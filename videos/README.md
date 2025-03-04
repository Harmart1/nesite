# Video Assets Directory

This directory contains video assets used throughout the NorthernEdge Legal Solutions website.

## Current Videos

- `DynamicLogoAnimation.mp4` - Homepage splash animation
  - Format: MP4
  - Resolution: 1920x1080 (recommended)
  - Duration: 8-10 seconds recommended for optimal user experience
  - Plays automatically when visitors reach the homepage

## Video Production Guidelines

### Logo Animation Design Guidelines

1. **Color Palette**: Use the website's color scheme:
   - Primary Blue: #1a3c5a
   - Secondary Blue: #578ab8
   - Accent Orange: #e8963a
   - Neutral Gray: #f5f8fb

2. **Transitions**:
   - Ensure smooth transitions between effects
   - The shattering and reassembly of elements should be fluid
   - Avoid abrupt stops or jarring movements

3. **Timing & Pacing**:
   - Total duration: 8-10 seconds maximum
   - Allow 1-2 seconds at the end with the final logo fully visible
   - Progressive animation speed (start slowly, build momentum)

4. **Visual Quality**:
   - Export at high quality (at least 1080p)
   - Use H.264 codec for optimal web compression
   - Target file size under 2MB for fast loading

## Implementation Details

1. The video automatically plays when the homepage loads
2. Sound is muted by default
3. A progress indicator shows video completion status
4. Users can skip the animation with the "Skip Intro" button
5. After completion, the video smoothly fades out to reveal the website

## Accessibility Considerations

- The video will not play for users with "prefers-reduced-motion" settings
- A skip option is provided for those who don't want to watch the animation
- The site remains fully functional if the video fails to load
