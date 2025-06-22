/**
 * Formats a date for chat messages
 * @param {string|Date} timestamp - The timestamp to format
 * @returns {string} Formatted time (today), "Yesterday", or date
 */
export const formatMessageDate = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString();
  }
};

/**
 * Formats time for chat messages
 * @param {string|Date} timestamp - The timestamp to format
 * @returns {string} Time in HH:MM format
 */
export const formatMessageTime = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

/**
 * Formats time for chat list
 * @param {string|Date} timestamp - The timestamp to format
 * @returns {string} - Time, "Yesterday", or date
 */
export const formatLastMessageTime = (timestamp) => {
  if (!timestamp) return '';
  
  const messageDate = new Date(timestamp);
  const today = new Date();
  
  if (messageDate.toDateString() === today.toDateString()) {
    return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (messageDate.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }
  
  return messageDate.toLocaleDateString();
};