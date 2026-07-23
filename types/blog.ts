export type BlogStatus = 'draft' | 'published' | 'scheduled';

export type ContentBlockType = 'heading' | 'text' | 'image' | 'video' | 'cta' | 'table' | 'columns';

export interface BlockSpacing {
  marginTop?: string;
  marginBottom?: string;
}

export interface BaseBlock {
  id: string;
  type: ContentBlockType;
  spacing?: BlockSpacing;
}

export interface HeadingBlock extends BaseBlock {
  type: 'heading';
  data: {
    level: 'h2' | 'h3' | 'h4';
    text: string;
    id: string;
    align?: 'left' | 'center' | 'right';
  };
}

export interface TextBlock extends BaseBlock {
  type: 'text';
  data: {
    html: string;
    lineHeight?: string;
    paragraphSpacing?: string;
    baseFontSize?: string;
  };
}

export interface ImageBlock extends BaseBlock {
  type: 'image';
  data: {
    layout: 'single' | 'grid-2' | 'grid-3' | 'grid-4';
    align?: 'left' | 'center' | 'right';
    textSide?: 'none' | 'left' | 'right';
    textHtml?: string;
    imageWidth?: '33' | '50' | '66';
    images: {
      url: string;
      alt: string;
      caption: string;
    }[];
  };
}

export interface VideoBlock extends BaseBlock {
  type: 'video';
  data: {
    url: string;
    title: string;
    transcript: string;
  };
}

export interface CTABlock extends BaseBlock {
  type: 'cta';
  data: {
    text: string;
    href: string;
    color: string;
    bgColor: string;
    openInNewTab: boolean;
  };
}

export interface TableBlock extends BaseBlock {
  type: 'table';
  data: {
    headers: string[];
    rows: string[][];
  };
}

export interface ColumnsBlock extends BaseBlock {
  type: 'columns';
  data: {
    layout: '50-50' | '33-33-33' | '66-33' | '33-66';
    columns: ContentLayoutBlock[][];
  };
}

export type ContentLayoutBlock =
  | HeadingBlock
  | TextBlock
  | ImageBlock
  | VideoBlock
  | CTABlock
  | TableBlock
  | ColumnsBlock;

export interface Blog {
  id: string;
  title: string;
  slug: string;
  content_layout: ContentLayoutBlock[];
  status: BlogStatus;
  published_at: string | null;
  author_id: string | null;
  meta_title: string | null;
  meta_description: string | null;
  focus_keywords: string[] | null;
  og_image: string | null;
  canonical_url: string | null;
  faqs: { question: string; answer: string }[] | null;
  dynamic_schema_json: any | null;
  created_at: string;
  updated_at: string;
}
