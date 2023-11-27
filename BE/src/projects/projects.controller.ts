import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { IsLoginGuard } from 'src/common/auth/IsLogin.guard';
import { Member } from 'src/common/decorators/memberDecorator';
import { memberDecoratorType } from 'src/common/types/memberDecorator.type';
import { CreateProjectRequestDto, CreateProjectResponseDto, ReadProjectListResponseDto } from './dto/Project.dto';
import { ProjectsService } from './projects.service';

@UseGuards(IsLoginGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsSevice: ProjectsService) {}
  @Post()
  createproject(
    @Member() memberInfo: memberDecoratorType,
    @Body() body: CreateProjectRequestDto,
  ): Promise<CreateProjectResponseDto> {
    return this.projectsSevice.createProject(body, memberInfo);
  }

  @Get()
  readProjectList(): Promise<ReadProjectListResponseDto[]> {
    return this.projectsSevice.readProjectList();
  }
}
