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
    this.workspace.addEventListener('mousedown', this.onMouseDown.bind(this));
    document.addEventListener('mousemove', this.onMouseMove.bind(this));
    document.addEventListener('mouseup', this.onMouseUp.bind(this));
    
    // Touch events
    this.workspace.addEventListener('touchstart', this.onTouchStart.bind(this));
    document.addEventListener('touchmove', this.onTouchMove.bind(this));
    document.addEventListener('touchend', this.onTouchEnd.bind(this));
    
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
}

// Export the class
window.WorkspacePan = WorkspacePan;
