export interface VocabularyItem {
  word: string;
  definition: string;
  in_story_usage: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
  milestone: 'Foundational Recall' | 'In-Story Reasoning' | 'Real-World Transfer' | string;
}

export interface StoryTeacherResponse {
  title: string;
  mission_hook: string;
  story_content: string;
  science_takeaway: string;
  vocabulary: VocabularyItem[];
  quiz: QuizQuestion[];
  dinner_table_question: string;
  diagnostic_summary: string;
  common_misconceptions: string;
}

export interface CuratedDemo {
  topic: string;
  age_bracket: string;
  theme: string;
  protagonist: string;
  data: StoryTeacherResponse;
}
