import React from 'react';

export type AppState = 'intro' | 'registration' | 'dashboard';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

export interface FileItem {
  id: string;
  name: string;
  size: string;
  type: 'folder' | 'file';
  date: string;
}

export interface PasswordItem {
  id: string;
  site: string;
  username: string;
  strength: 'weak' | 'medium' | 'strong';
}

export interface SnippetItem {
  id: string;
  title: string;
  language: string;
  code: string;
}

export interface AnalyticData {
  name: string;
  value: number;
}