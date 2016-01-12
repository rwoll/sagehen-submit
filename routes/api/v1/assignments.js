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

/**
 * Return a list of all the assignments.
 * @param  {Object}   req  The request object.
 * @param  {Object}   res  The response object.
 * @param  {Function} next The subsequent handler function.
 * @return {Object}        Response object with converted json.
 */
var listAssignments = function (req, res, next) {
  Assignment.find().lean().select('-files').exec(function (err, assignments) {
    if (err) return next(err);
    return res.json({ 'assignments': assignments });
  });
};

/**
 * Create an assignment and reply to the client.
 * @param  {Object}   req  The request object.
 * @param  {Object}   res  The response object.
 * @param  {Function} next The subsequent handler function.
 * @return {Object}        Response object with converted json.
 */
var createAssignment = function (req, res, next) {
  new Assignment({
    title: req.body.title,
    duedate: req.body.duedate,
    rawfiles: req.body.files
  }).save(function (err, assignment) {
    if (err) return next(err);
    return res.status(201).json({ 'assignment': assignment });
  });
};

/**
 * Lists the full details for an individual assignment.
 *
 * @param  {Object}   req  The request object.
 * @param  {Object}   res  The response object.
 * @param  {Function} next The subsequent handler function.
 * @return {Object}        Response object with converted json.
 */
var listAssignment = function (req, res, next) {
  // @TODO add the students submission status onto the assignment
  return res.json({ assignment: req.user.assignment });
};

var getSubmission = function (req, res, next) {
  return res.json({ submission: req.user.submission });
};

/**
 * Create a submission for a student.
 * @param  {Object}   req  The request object.
 * @param  {Object}   res  The response object.
 * @param  {Function} next The subsequent handler function.
 * @return {Object}        Response object with converted json.
 */
var addSubmission = function (req, res, next) {
  new Submission({
    owner: req.user._id,
    assignment: req.user.assignment._id,
    rawfiles: req.body.files,
    notes: req.body.notes
  }).save(function (err, sub) {
    if (err) return next(err);
    return res.status(201).json({ submission: sub });
  });
};

// ========== PARAMETER VALIDATION =============================================
// Handle assignment parameter and set request object
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

// Handle submission parameter and set request object
router.param('submissionID', function (req, res, next, sID) {
  Submission.findById(sID, function (err, submission) {
    if (err) return next(err);

    if (!submission) {
      return res.status(404).json({
        error: { status: 404, message: 'Bad submission.'}
      });
    }

    if (submission.owner.equals(req.user._id) || req.user.role === 'PROF') {
      req.user.submission = submission;
      return next();
    } else {
      return res.status(403).json({
        error: { status: 403, message: 'Unauthorized.'}
      });
    }
  });
});

// ========== ROUTING ==========================================================
router
  .get('/', listAssignments) // list all assignments
  .post('/', limit(['PROF']), createAssignment) // create an assignment
  .get('/:assignmentID/', listAssignment); // get an individual assignment
  // .put('/:aID', limit(['PROF']), updateAssignment)
  // .delete('/:aID', limit(['PROF']), deleteAssignment);

// Submission Routing
router
  .post('/:assignmentID/submissions/', limit(['STU']), addSubmission)
  .get('/:assignmentID/submissions/:submissionID', getSubmission);

module.exports = router;
