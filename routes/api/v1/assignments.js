/**
 * Handle creation of assignments.
 *
 * @author Ross A. Wollman
 */

var express = require('express');
var router = express.Router();
var Assignment = require('../../../models/assignment');
var Submission = require('../../../models/submission');
var limit = require('../../../middleware/rolelimit');

// ========== Route Handlers ===================================================
var listAssignments = function (req, res, next) {
  Assignment.find(function (err, assignments) {
    if (err) return next(err);
    return res.json({ assignments: assignments });
  });
};

var createAssignment = function (req, res, next) {
  new Assignment({
    title: req.body.title,
    duedate: req.body.duedate,
    reqFiles: req.body.reqFiles
  }).save(function (err, assignment) {
    if (err) return next(err);
    return res.json({ assignment: assignment });
  });
};

var listAssignment = function (req, res, next) {
  return res.json({ assignment: req.user.assignment });
};

var addSubmission = function (req, res, next) {
  new Submission({
    owner: req.user._id,
    assignment: req.user.assignment._id,
    notes: req.body.notes
  }).save(function (err, sub) {
    if (err) return next(err);
    return res.json({ assignment: req.user.assignment, submission: sub });
  });
};

// ========== PARAMETER VALIDATION =============================================
router.param('assignmentID', function (req, res, next, aID) {
  Assignment.findById(aID, function (err, assignment) {
    if (err) return next(err);

    if (!assignment) {
      return res.status(404).json({
        error: { status: 404, message: 'Bad aID.'}
      });
    }

    req.user.assignment = assignment;
    return next();
  });
});

router.param('submissionID', function (req, res, next, sID) {
  Submission.findById(sID, function (err, submission) {
    if (err) return next(err);

    if (!assignment) {
      return res.status(404).json({
        error: { status: 404, message: 'Bad aID.'}
      });
    }

    if (submission.owner === req.user._id || req.user.role === 'PROF') {
      req.user.submission = submission;
      return next();
    } else {
      return res.status(403).json({
        error: {status: 403, message: 'Unauthorized.'}
      });
    }
  });
});

// ========== ROUTING ==========================================================
router
  .get('/', listAssignments)
  .post('/', limit(['PROF']), createAssignment)
  .get('/:assignmentID/', listAssignment);
  // .put('/:aID', limit(['PROF']), updateAssignment)
  // .delete('/:aID', limit(['PROF']), deleteAssignment);

// Submission Routing
router
  .post('/:assignmentID/submissions/', limit(['STU']), addSubmission);

module.exports = router;
