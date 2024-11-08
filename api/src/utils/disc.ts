// credits: https://stackoverflow.com/a/71480456/15710459

import { SchemaFactory } from '@nestjs/mongoose';
import { DiscriminatorOptions } from '@nestjs/mongoose/dist/interfaces/model-definition.interface';
import { Schema } from 'mongoose';

type TClass<T = any> = new (...args: any[]) => T;

export function initDiscriminators<T extends TClass>(
  rootClass: T,
  path: string,
  discriminators: DiscriminatorOptions[],
): Schema<T> {
  const root = SchemaFactory.createForClass(rootClass);
  const child = root.path(path);

  discriminators.forEach((discriminator) => {
    child['discriminator'](discriminator.name, discriminator.schema);
  });

  return root;
}
