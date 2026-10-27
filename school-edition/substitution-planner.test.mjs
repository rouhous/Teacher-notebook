import {planSubstitutions} from './substitution-planner.mjs';
import assert from 'node:assert/strict';
const date='2026-10-27',schoolId='boys';
const lessons=[
{id:'one',date,period:1,teacherId:'A',schoolId,classId:'9-1'},
{id:'two',date,period:1,teacherId:'B',schoolId,classId:'9-2'},
{id:'three',date,period:2,teacherId:'A',schoolId,classId:'9-3'}];
const reserveSlots=[
{teacherId:'B',date,period:1,schoolId,priority:'A'},
{teacherId:'C',date,period:1,schoolId,priority:'B'},
{teacherId:'D',date,period:1,schoolId,priority:'C'},
{teacherId:'C',date,period:2,schoolId,priority:'A'}];
const absent=[{teacherId:'A',date},{teacherId:'B',date}];
const result=planSubstitutions({lessons,reserveSlots,absences:absent});
assert.equal(result.assignments.length,3);
assert.equal(result.uncovered.length,0);
assert.ok(result.assignments.every(a=>a.substituteTeacherId!=='A'&&a.substituteTeacherId!=='B'));
assert.equal(new Set(result.assignments.filter(a=>a.period===1).map(a=>a.substituteTeacherId)).size,2);
assert.equal(result.assignments.find(a=>a.originalLessonId==='one').priority,'B');
const noCoverage=planSubstitutions({lessons,reserveSlots,absences:[...absent,{teacherId:'C',date},{teacherId:'D',date}]});
assert.equal(noCoverage.assignments.length,0);
assert.equal(noCoverage.uncovered.length,3);
const partial=planSubstitutions({lessons,reserveSlots,absences:[{teacherId:'A',date,periods:[1]},{teacherId:'B',date,periods:[1]}]});
assert.equal(partial.assignments.length,2);
assert.equal(partial.assignments.some(a=>a.period===2),false);
console.log('All substitution planner tests passed.');
