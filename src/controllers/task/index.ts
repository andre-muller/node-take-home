import { Request, Response } from 'express';
import DbTaskListRepository from '@/repositories/db-task-list/db-task-list-repository';
import DbTaskRepository from '@/repositories/db-task-list/db-task-repository';
import {
  ServiceListTask,
  ServiceCreateTask,
  ServiceUpdateTask,
  ServiceDeleteTask,
  ServiceChangeTaskStatus,
} from '@/usecases/implementations/task';
import { handleError } from '@/util/errors/handle-errors';
import { TaskRepository } from '@/repositories/protocols/task-repository';
import { TaskListRepository } from '@/repositories/protocols/task-list-repository';

class TaskController {
  private dbTaskListRepository: TaskListRepository;

  private dbTaskRepository: TaskRepository;

  constructor() {
    this.dbTaskListRepository = new DbTaskListRepository();
    this.dbTaskRepository = new DbTaskRepository();
  }

  public async index(req: Request, res: Response) {
    try {
      const serviceListTaskList = new ServiceListTask(this.dbTaskRepository);

      const lists = await serviceListTaskList.list();

      res.json(lists);
    } catch (err) {
      return handleError(res, err);
    }
  }

  public async store(req: Request, res: Response) {
    try {
      const serviceCreateTask = new ServiceCreateTask(
        this.dbTaskRepository,
        this.dbTaskListRepository,
      );
      const { name, duration, task_list_id, dependency_id } = req.body;

      const newTask = await serviceCreateTask.create({
        name,
        duration,
        task_list_id,
        dependency_id,
      });
      res.json(newTask);
    } catch (err) {
      return handleError(res, err);
    }
  }

  public async update(req: Request, res: Response) {
    try {
      const serviceCreateTaskList = new ServiceUpdateTask(
        this.dbTaskRepository,
        this.dbTaskListRepository,
      );
      const id = Number(req.params.taskListId);
      const { name, duration } = req.body;

      const newTaskList = await serviceCreateTaskList.update({
        id,
        name,
        duration,
      });
      res.json(newTaskList);
    } catch (err) {
      return handleError(res, err);
    }
  }

  public async remove(req: Request, res: Response) {
    try {
      const serviceCreateTaskList = new ServiceDeleteTask(
        this.dbTaskRepository,
        this.dbTaskListRepository,
      );
      const id = Number(req.params.taskListId);

      const newTaskList = await serviceCreateTaskList.delete(id);
      res.json(newTaskList);
    } catch (err) {
      return handleError(res, err);
    }
  }

  public async changeStatus(req: Request, res: Response) {
    try {
      const serviceCreateTaskList = new ServiceChangeTaskStatus(
        this.dbTaskRepository,
        this.dbTaskListRepository,
      );
      const id = Number(req.params.taskListId);
      const { status } = req.body;

      const newTaskList = await serviceCreateTaskList.changeStatus({
        id,
        status,
      });
      return res.json(newTaskList);
    } catch (err) {
      return handleError(res, err);
    }
  }
}

export default TaskController;
