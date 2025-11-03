// src/components/OpinionPost.test.jsx

// --- ADD userEvent TO YOUR IMPORTS ---
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'; // <-- ADD THIS
import { describe, it, expect, vi } from 'vitest'; // <-- ADD vi
import OpinionPost from './OpinionPost';

describe('OpinionPost Component', () => {

  // Your first test ("renders all post details") is still here...

  // --- ADD THIS NEW TEST BLOCK ---
  it("should call onCommentClick with the post ID when 'My opinion' button is clicked", async () => {
    // 1. Setup
    const user = userEvent.setup();
    const mockPost = { postId: 'pid-abcde' };
    const mockCommentHandler = vi.fn();

    // 2. Render
    render(<OpinionPost post={mockPost} onCommentClick={mockCommentHandler} />);

    // 3. Act
    const commentButton = screen.getByRole('button', { name: 'My opinion on this' });
    await user.click(commentButton);

    // 4. Assert
    expect(mockCommentHandler).toHaveBeenCalledTimes(1);
    expect(mockCommentHandler).toHaveBeenCalledWith('pid-abcde');
  });
  
});