import faker from 'faker';
import { TaskRepository } from '~/repositories/protocols/task-list-repository';
import { InMemoryTaskListRepository } from '../fakeRepositories/inMemory-task-list-repository';
import { ServiceDeleteTaskList } from '~/usecases/implementations/task-list/delete-task-list';
import { DeleteTaskList } from './protocols';

const makeSut = (): SutTypes => {
  const taskRepository = new InMemoryTaskListRepository();
  const sut = new ServiceDeleteTaskList(taskRepository);
  return {
    sut,
    taskRepository,
  };
};

type SutTypes = {
  sut: DeleteTaskList;
  taskRepository: TaskRepository;
};

describe('Delete a TaskList', () => {
  test('Should call TaskList findById with correct params', async () => {
    const { sut, taskRepository } = makeSut();
    const fakeTaskList = await taskRepository.create({
      name: faker.vehicle.model(),
      due_date: faker.date.future(1),
    });

    const deleteTaskList = jest.spyOn(sut, 'delete');
    await sut.delete(fakeTaskList.id);
    expect(deleteTaskList).toHaveBeenCalledWith(fakeTaskList.id);
  });

  test('Should return false if task list does not exists', async () => {
    const { sut } = makeSut();

    const deleteTaskList = await sut.delete(11111);

    expect(deleteTaskList).toBeFalsy();
  });

  test('Should return true on success', async () => {
    const { sut, taskRepository } = makeSut();
    const fakeTaskList = await taskRepository.create({
      name: faker.vehicle.model(),
      due_date: faker.date.future(1),
    });

    const deleteTaskList = await sut.delete(fakeTaskList.id);

    expect(deleteTaskList).toBeTruthy();
  });
});
