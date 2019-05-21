export interface StoryblokStories {
  [key: string]: {
    loading: boolean;
    story: object
  }
}

export interface StoryblokState {
  previewToken?: string;
  stories: StoryblokStories;
}
