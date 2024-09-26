export const extractIdFromUrl = (url) => {
    const match = url.match(/^\/user\/([0-9]+)$/);  // Only match /user/123
    return match ? match[ 1 ] : null;  // Return the ID if it matches
};