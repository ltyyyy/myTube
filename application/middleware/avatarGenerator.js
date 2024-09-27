// Function to generate default avatar SVG with random background color and user's first letter
function generateDefaultAvatar(username) {
  const firstLetter = username.charAt(0); // Keep the original case of the first letter

  // Array of colors to randomly choose from
  const colors = ['#fa8c8c', '#f0d067', '#6ecf65', '#53dba1', '#5ad4ed', '#72bef7', '#7298f7', '#b18dfc'];
  const backgroundColor = colors[Math.floor(Math.random() * colors.length)];

  // Return SVG as a string with a smaller circle and centered text
  return `
    <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
      <style>
        text {
          font-family: 'Arial', sans-serif;
        }
      </style>
      <circle cx="20" cy="20" r="20" fill="${backgroundColor}" />
      <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-size="25" fill="white">${firstLetter}</text>
    </svg>
  `;
}

module.exports = { generateDefaultAvatar };
