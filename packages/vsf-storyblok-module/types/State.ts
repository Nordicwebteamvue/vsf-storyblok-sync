export interface StoryblokStoryData {
  loading: boolean;
  story: object;
}

export interface StoryblokStories {
  [key: string]: StoryblokStoryData
}

export interface StoryblokState {
  previewToken?: string;
  stories: StoryblokStories;
}
