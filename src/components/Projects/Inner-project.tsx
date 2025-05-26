'use client';

import React from 'react';
import Carousel from './Carousel';

type InnerProjectProps = {
  images: string[];
};

export default function InnerProject({ images }: InnerProjectProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Carousel images={images} />
    </div>
  );
}