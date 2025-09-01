import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Random Word Picker title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Random Word Picker/i);
  expect(titleElement).toBeInTheDocument();
});
