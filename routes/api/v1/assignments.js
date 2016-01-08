/**
 * Handle creation of assignments.
 *
 * @author Ross A. Wollman
 */

var express = require('express');
var router = express.Router();
var Asgt = require('../../../models/assignment');
var Sub = require('../../../models/submission');
var roleLimit = require('../../../middleware/rolelimit');

router
  .post('/', roleLimit(['PROF']), function (req, res, next) {
    var asgt = new Asgt({
      title: req.body.title,
      duedate: req.body.duedate,
      reqFiles: req.body.reqFiles
    });

    asgt.save(function (err) {
      if (err) {
        if (err.name === 'ValidationError') {
          return res.status(400).json({
            error: { status: 400, message: err.errors }
          });
        } else {
          return next(err);
        }
      } else {
        return res.json({ assignment: asgt });
      }
    });
  })

  .get('/', function (req, res, next) {
    if (req.user.role === 'PROF') {
      // return all assignments
      Asgt.find({}, function (err, asgts) {
        if (err) return next(err);
        return res.json({ assignments: asgts });
      });
    } else if (req.user.role === 'STU') {
      Asgt.find({ submissions: req.user._id }, function (err, asgts) {
        if (err) return next(err);
        return res.json({ submittedAssignments: asgts });
      });
    // return list of completed assignments and list of incomplete assignments
    } else {
      return res.status(400).json({
        error: { status: 400, message: 'No fucntionality for this group' }
      });
    }
  })

  .post('/:id', roleLimit(['STU']), function (req, res, next) {
    // create new submission for the student
    var sub = new Sub({
      owner: req.user._id,
      assignment: req.params.id, /** @REVIEW examine if the save of this object will validate this id! */
      notes: req.body.notes
    });

    sub.save(function (err) {
      if (err) return next(err);
      // if no error, add this submission to the assignment (they will reference eachother)
      Asgt.findById(req.params.id, function (err, asgt) {
        asgt.submissions.push(sub._id);
        asgt.save(function (err) {
          if (err) return next(err);
          return res.json({ submission: sub });
        });
      });
    });
  });

module.exports = router;
