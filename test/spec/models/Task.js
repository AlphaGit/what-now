'use strict';

describe('Task model', function() {
  it('should be defined', function() {
    expect(Task).toBeDefined();
  });

  describe('#constructor', function() {
    it('should allow a task to be created with a name parameter', function() {
      var task = new Task('my task name');
      expect(task.name).toBe('my task name');
    });

    it('should allow a task to be created with a complete object', function() {
      var depTask1 = new Task('depTask1');
      var depTask2 = new Task('depTask1');

      var task = new Task({
        name: 'example task',
        isComplete: true,
        previous: [depTask1, depTask2]
      });

      expect(task.name).toBe('example task');
      expect(task.isComplete).toBe(true);
      expect(task.previous).toBeDefined();
      expect(task.previous.length).toBe(2);
      expect(task.previous[0]).toBe(depTask1);
      expect(task.previous[1]).toBe(depTask2);
    });

    it('should assign a task id to a new task', function() {
      var task = new Task('task');

      expect(task.taskId).toBeTruthy();
    });
  });

  describe('#toString', function() {
    it('should provide the task type, id and name', function() {
      var task = new Task('task');
      var taskString = task.toString();

      expect(taskString.indexOf(task.taskId) > -1).toBe(true);
      expect(taskString.indexOf('Task') > -1).toBe(true);
      expect(taskString.indexOf(task.name) > -1).toBe(true);
    });
  });

  describe('#clone', function() {
    it('should be defined', function () {
      var task = new Task();
      expect(task.clone).toBeDefined();
    });

    it('should return a copy of the current task', function() {
      var previousTask = new Task('previous');
      var nextTask = new Task('next');
      var task = new Task('data');
      task.addPrevious(previousTask);
      task.addNext(nextTask);
      task.isComplete = true;
      task.isSelected = true;

      var cloned = task.clone();

      expect(cloned).not.toBe(task);
      expect(cloned.data).toBe(task.data);
      expect(cloned.name).toBe(task.name);
      expect(cloned.isSuggested).toBe(task.isSuggested);
      expect(cloned.isComplete).toBe(task.isComplete);
      expect(cloned.isSelected).toBe(task.isSelected);

      expect(cloned.next).not.toBe(task.next);
      expect(cloned.next.length).toBe(task.next.length);
      expect(cloned.next.every(function(next) {
        return task.next.indexOf(next) > -1;
      })).toBe(true);

      expect(cloned.previous).not.toBe(task.previous);
      expect(cloned.previous.length).toBe(task.previous.length);
      expect(cloned.previous.every(function(previous) {
        return task.previous.indexOf(previous) > -1;
      })).toBe(true);
    });
  });
});