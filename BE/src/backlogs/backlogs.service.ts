import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBacklogsEpicDto } from 'src/dto/create-backlogs-epic.dto';
import { CreateBacklogsStoryDto } from 'src/dto/create-backlogs-story.dto';
import { CreateBacklogsTaskDto } from 'src/dto/create-backlogs-task.dto';
import { DeleteBacklogsEpicDto } from 'src/dto/delete-backlogs-epic.dto';
import { UpdateBacklogsEpicDto } from 'src/dto/update-backlogs-epic.dto';
import { Epic } from 'src/entities/epic.entity';
import { Story } from 'src/entities/story.entity';
import { Task } from 'src/entities/task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BacklogsService {
  constructor(
    @InjectRepository(Epic) private epicRepository: Repository<Epic>,
    @InjectRepository(Story) private storyRepository: Repository<Story>,
    @InjectRepository(Task) private taskRepository: Repository<Task>,
  ) {}

  async createEpic(dto: CreateBacklogsEpicDto): Promise<void> {
    const newEpic = this.epicRepository.create({ title: dto.epicTitle });
    await this.storyRepository.save(newEpic);
  }

  async createStory(dto: CreateBacklogsStoryDto): Promise<void> {
    const epic = await this.epicRepository.findOne({ where: { id: dto.story.epicId } });
    const newStory = this.storyRepository.create({ title: dto.story.title, epic });
    await this.storyRepository.save(newStory);
  }

  async createTask(dto: CreateBacklogsTaskDto): Promise<void> {
    const epic = await this.epicRepository.findOne({ where: { id: dto.task.epicId } });
    const story = await this.storyRepository.findOne({ where: { id: dto.task.storyId } });
    const newTask = this.taskRepository.create({
      title: dto.task.title,
      state: dto.task.state,
      point: dto.task.point,
      condition: dto.task.condition,
      userId: dto.task.userId,
      epic,
      story,
    });
    await this.taskRepository.save(newTask);
  }

  async updateEpic(dto: UpdateBacklogsEpicDto): Promise<void> {
    const epic = await this.epicRepository.findOne({ where: { id: dto.epic.id } });
    epic.title = dto.epic.title;
    await this.epicRepository.save(epic);
  }

  async deleteEpic(dto: DeleteBacklogsEpicDto): Promise<void> {
    const epic = await this.epicRepository.findOne({ where: { id: dto.epicId } });
    await this.epicRepository.remove(epic);
  }
}
