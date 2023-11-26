import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Epic } from 'src/backlogs/entities/epic.entity';
import { Story } from 'src/backlogs/entities/story.entity';
import { Task } from 'src/backlogs/entities/task.entity';
import { Project } from 'src/projects/entity/project.entity';
import { Repository } from 'typeorm';
import { MTask, MEpic, MStory, ReadBacklogResponseDto } from './dto/backlog.dto';
import {
  CreateBacklogsEpicRequestDto,
  CreateBacklogsEpicResponseDto,
  DeleteBacklogsEpicRequestDto,
  UpdateBacklogsEpicRequestDto,
} from './dto/Epic.dto';
import {
  CreateBacklogsStoryRequestDto,
  CreateBacklogsStoryResponseDto,
  DeleteBacklogsStoryRequestDto,
  UpdateBacklogsStoryRequestDto,
} from './dto/Story.dto';
import {
  CreateBacklogsTaskRequestDto,
  CreateBacklogsTaskResponseDto,
  DeleteBacklogsTaskRequestDto,
  UpdateBacklogsRequestTaskDto,
} from './dto/Task.dto';

@Injectable()
export class BacklogsService {
  constructor(
    @InjectRepository(Project) private projectRepository: Repository<Project>,
    @InjectRepository(Epic) private epicRepository: Repository<Epic>,
    @InjectRepository(Story) private storyRepository: Repository<Story>,
    @InjectRepository(Task) private taskRepository: Repository<Task>,
  ) {}

  async readBacklog(id: number): Promise<ReadBacklogResponseDto> {
    const project = await this.findProject(id);
    const backlog = new ReadBacklogResponseDto();
    backlog.epicList = await this.findEpics(project.id);
    return backlog;
  }

  private async findProject(id: number): Promise<Project> {
    const project = await this.projectRepository.findOne({ where: { id } });
    if (project === null) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return project;
  }

  private async findEpics(projectId: number): Promise<MEpic[]> {
    const epicDataList = await this.epicRepository.find({ where: { project: { id: projectId } } });
    return Promise.all(epicDataList.map(async (epicData) => this.buildEpic(epicData)));
  }

  private async buildEpic(epicData: Epic): Promise<MEpic> {
    const epic = new MEpic();
    epic.id = epicData.id;
    epic.title = epicData.title;
    epic.storyList = await this.findStories(epic.id);
    return epic;
  }

  private async findStories(epicId: number): Promise<MStory[]> {
    const storyDataList = await this.storyRepository.find({ where: { epic: { id: epicId } } });
    return Promise.all(storyDataList.map(async (storyData) => this.buildStory(storyData)));
  }

  private async buildStory(storyData: Story): Promise<MStory> {
    const story = new MStory();
    story.id = storyData.id;
    story.title = storyData.title;
    story.taskList = await this.findTasks(story.id);
    return story;
  }

  private async findTasks(storyId: number): Promise<MTask[]> {
    const taskDataList = await this.taskRepository.find({ where: { story: { id: storyId } } });
    return taskDataList.map((taskData) => this.buildTask(taskData));
  }

  private buildTask(taskData: Task): MTask {
    const task = new MTask();
    task.id = taskData.id;
    task.point = taskData.point;
    task.state = taskData.state;
    task.condition = taskData.condition;
    task.title = taskData.title;
    task.userName = null; //추후 유저로직 추가
    return task;
  }

  async createEpic(dto: CreateBacklogsEpicRequestDto): Promise<CreateBacklogsEpicResponseDto> {
    const project = await this.projectRepository.findOne({ where: { id: dto.projectId } });
    const newEpic = this.epicRepository.create({ title: dto.title, project: project });
    const savedEpic = await this.epicRepository.save(newEpic);
    return { id: savedEpic.id };
  }

  async createStory(dto: CreateBacklogsStoryRequestDto): Promise<CreateBacklogsStoryResponseDto> {
    const epic = await this.epicRepository.findOne({ where: { id: dto.epicId } });
    const newStory = this.storyRepository.create({ title: dto.title, epic });
    const savedStory = await this.storyRepository.save(newStory);
    return { id: savedStory.id };
  }

  async createTask(dto: CreateBacklogsTaskRequestDto): Promise<CreateBacklogsTaskResponseDto> {
    const story = await this.storyRepository.findOne({ where: { id: dto.storyId } });
    const newTask = this.taskRepository.create({
      title: dto.title,
      state: dto.state,
      point: dto.point,
      condition: dto.condition,
      story,
    });
    if (dto.userId !== undefined) newTask.userId = dto.userId;
    const savedTask = await this.taskRepository.save(newTask);
    return { id: savedTask.id };
  }

  async updateEpic(dto: UpdateBacklogsEpicRequestDto): Promise<void> {
    const epic = await this.epicRepository.findOne({ where: { id: dto.id } });
    epic.title = dto.title;
    await this.epicRepository.save(epic);
  }

  async updateStory(dto: UpdateBacklogsStoryRequestDto): Promise<void> {
    const story = await this.storyRepository.findOne({ where: { id: dto.id } });
    story.title = dto.title;
    await this.storyRepository.save(story);
  }

  async updateTask(dto: UpdateBacklogsRequestTaskDto): Promise<void> {
    const updateTaskData: Partial<Task> = {};
    if ((await this.taskRepository.findOne({ where: { id: dto.id } })) === null)
      throw new NotFoundException(`Task with ID ${dto.id} not found`);
    if (Object.keys(dto).length <= 1)
      throw new BadRequestException('No update data provided. Please specify the fields to be updated.');

    Object.keys(dto).forEach((key) => {
      if (dto[key] !== undefined) {
        updateTaskData[key] = dto[key];
      }
    });
    await this.taskRepository.update(dto.id, updateTaskData);
  }

  async deleteEpic(dto: DeleteBacklogsEpicRequestDto): Promise<void> {
    const epic = await this.epicRepository.findOne({ where: { id: dto.id } });
    await this.epicRepository.remove(epic);
  }

  async deleteStory(dto: DeleteBacklogsStoryRequestDto): Promise<void> {
    const story = await this.storyRepository.findOne({ where: { id: dto.id } });
    await this.storyRepository.remove(story);
  }

  async deleteTask(dto: DeleteBacklogsTaskRequestDto): Promise<void> {
    const task = await this.taskRepository.findOne({ where: { id: dto.id } });
    await this.taskRepository.remove(task);
  }
}
