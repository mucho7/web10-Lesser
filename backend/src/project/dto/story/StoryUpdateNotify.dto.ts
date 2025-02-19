import { StoryStatus } from 'src/project/entity/story.entity';

class Story {
  id: number;
  epicId?: number;
  title?: string;
  point?: number;
  status?: StoryStatus;

  static of(
    id: number,
    epicId: number | undefined,
    title: string | undefined,
    point: number | undefined,
    status: StoryStatus | undefined,
  ) {
    const dto = new Story();
    dto.id = id;
    if (title !== undefined) dto.title = title;
    if (point !== undefined) dto.point = point;
    if (status !== undefined) dto.status = status;
    if (epicId !== undefined) dto.epicId = epicId;
    return dto;
  }
}

export class StoryUpdateNotifyDto {
  domain: string;
  action: string;
  content: Story;

  static of(
    id: number,
    epicId: number | undefined,
    title: string | undefined,
    point: number | undefined,
    status: StoryStatus | undefined,
  ) {
    const dto = new StoryUpdateNotifyDto();
    dto.domain = 'story';
    dto.action = 'update';
    dto.content = Story.of(id, epicId, title, point, status);
    return dto;
  }
}
