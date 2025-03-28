/**
 * WorkspacePan - A class to handle panning within a workspace
 */
class WorkspacePan {
  constructor(workspaceElement) {
    this.workspace = workspaceElement;
    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;
    this.scrollLeft = 0;
    this.scrollTop = 0;
    
    this.init();
  }
  
  init() {
    // Mouse events
    // Store bound event handlers
    this.boundMouseDown = this.onMouseDown.bind(this);
    this.boundMouseMove = this.onMouseMove.bind(this);
    this.boundMouseUp = this.onMouseUp.bind(this);
    this.boundTouchStart = this.onTouchStart.bind(this);
    this.boundTouchMove = this.onTouchMove.bind(this);
    this.boundTouchEnd = this.onTouchEnd.bind(this);

    // Mouse events
    this.workspace.addEventListener('mousedown', this.boundMouseDown);
    document.addEventListener('mousemove', this.boundMouseMove);
    document.addEventListener('mouseup', this.boundMouseUp);
    
    // Touch events
    this.workspace.addEventListener('touchstart', this.boundTouchStart);
    document.addEventListener('touchmove', this.boundTouchMove);
    document.addEventListener('touchend', this.boundTouchEnd);
    
    // Change cursor to indicate the workspace is pannable
    this.workspace.style.cursor = 'grab';
  }
  
  onMouseDown(e) {
    if (e.button !== 0) return; // Only left mouse button
    
    this.isDragging = true;
    this.startX = e.pageX - this.workspace.offsetLeft;
    this.startY = e.pageY - this.workspace.offsetTop;
    this.scrollLeft = this.workspace.scrollLeft;
    this.scrollTop = this.workspace.scrollTop;
    
    this.workspace.style.cursor = 'grabbing';
    e.preventDefault();
  }
  
  onMouseMove(e) {
    if (!this.isDragging) return;
    
    const x = e.pageX - this.workspace.offsetLeft;
    const y = e.pageY - this.workspace.offsetTop;
    
    // Calculate how far the mouse has moved
    const walkX = x - this.startX;
    const walkY = y - this.startY;
    
    // Scroll the workspace
    this.workspace.scrollLeft = this.scrollLeft - walkX;
    this.workspace.scrollTop = this.scrollTop - walkY;
  }
  
  onMouseUp() {
    this.isDragging = false;
    this.workspace.style.cursor = 'grab';
  }
  
  onTouchStart(e) {
    if (e.touches.length !== 1) return; // Only single touch
    
    this.isDragging = true;
    this.startX = e.touches[0].pageX - this.workspace.offsetLeft;
    this.startY = e.touches[0].pageY - this.workspace.offsetTop;
    this.scrollLeft = this.workspace.scrollLeft;
    this.scrollTop = this.workspace.scrollTop;
  }
  
  onTouchMove(e) {
    if (!this.isDragging || e.touches.length !== 1) return;
    
    const x = e.touches[0].pageX - this.workspace.offsetLeft;
    const y = e.touches[0].pageY - this.workspace.offsetTop;
    
    // Calculate how far the touch has moved
    const walkX = x - this.startX;
    const walkY = y - this.startY;
    
    // Scroll the workspace
    this.workspace.scrollLeft = this.scrollLeft - walkX;
    this.workspace.scrollTop = this.scrollTop - walkY;
    
    e.preventDefault();
  }
  
  onTouchEnd() {
    this.isDragging = false;
  }

  /**
   * Cleanup method to remove event listeners and prevent memory leaks
   */
  destroy() {
    // Remove mouse events
    // Remove mouse events
    this.workspace.removeEventListener('mousedown', this.boundMouseDown);
    document.removeEventListener('mousemove', this.boundMouseMove);
    document.removeEventListener('mouseup', this.boundMouseUp);

    // Remove touch events
    this.workspace.removeEventListener('touchstart', this.boundTouchStart);
    document.removeEventListener('touchmove', this.boundTouchMove);
    document.removeEventListener('touchend', this.boundTouchEnd);

    // Reset cursor style
    this.workspace.style.cursor = '';
  }
}

// Export the class
window.WorkspacePan = WorkspacePan;
