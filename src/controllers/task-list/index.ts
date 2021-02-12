import { Request, Response } from 'express';
import DbTaskListRepository from '@/repositories/db-task-list/db-task-list-repository';
import {
  ServiceListTaskList,
  ServiceCreateTaskList,
  ServiceUpdateTaskList,
  ServiceDeleteTaskList,
} from '@/usecases/implementations/task-list';
import { handleError } from '@/util/errors/handle-errors';
import { TaskListRepository } from '@/repositories/protocols/task-list-repository';

class TaskListController {
  private dbTaskListRepository: TaskListRepository;

  constructor() {
    this.dbTaskListRepository = new DbTaskListRepository();
  }

  public async index(req: Request, res: Response) {
    try {
      const serviceListTaskList = new ServiceListTaskList(
        this.dbTaskListRepository,
      );

      const lists = await serviceListTaskList.list();

      res.json(lists);
    } catch (err) {
      return handleError(res, err);
    }
  }

  public async store(req: Request, res: Response) {
    try {
      const serviceCreateTaskList = new ServiceCreateTaskList(
        this.dbTaskListRepository,
      );
      const { name, due_date } = req.body;

      const newTaskList = await serviceCreateTaskList.create({
        name,
        due_date,
      });
      res.json(newTaskList);
    } catch (err) {
      return handleError(res, err);
    }
  }

  public async update(req: Request, res: Response) {
    try {
      const serviceCreateTaskList = new ServiceUpdateTaskList(
        this.dbTaskListRepository,
      );
      const id = Number(req.params.taskListId);
      const { name, due_date } = req.body;

      const newTaskList = await serviceCreateTaskList.update({
        id,
        name,
        due_date,
      });
      res.json(newTaskList);
    } catch (err) {
      return handleError(res, err);
    }
  }

  public async remove(req: Request, res: Response) {
    try {
      const serviceCreateTaskList = new ServiceDeleteTaskList(
        this.dbTaskListRepository,
      );
      const id = Number(req.params.taskListId);

      const newTaskList = await serviceCreateTaskList.delete(id);
      res.json(newTaskList);
    } catch (err) {
      return handleError(res, err);
    }
  }
}

export default TaskListController;
