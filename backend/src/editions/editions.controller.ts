import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EditionsService } from './editions.service';
import { CreateEditionDTO } from './dto/create-edition.dto';
import { UpdateEditionDto } from './dto/update-edition.dto';

@Controller('editions')
export class EditionsController {
  constructor(private readonly editionsService: EditionsService) {}

  @Post()
  create(@Body() createEditionDto: CreateEditionDTO) {
    return this.editionsService.create(createEditionDto);
  }

  @Get()
  findAll() {
    return this.editionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.editionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEditionDto: UpdateEditionDto) {
    return this.editionsService.update(+id, updateEditionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.editionsService.remove(+id);
  }
}
