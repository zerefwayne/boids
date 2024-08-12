class KDTreeNode {
  constructor(boid, axis) {
    this.boid = boid; // The boid object { id, x, y, velocity: [vx, vy] }
    this.left = null; // Left child in the tree
    this.right = null; // Right child in the tree
    this.axis = axis; // Axis (dimension) by which the space is divided
  }
}

class KDTree {
  constructor(boids, depth = 0) {
    this.root = this.buildTree(boids, depth);
  }

  buildTree(boids, depth) {
    if (boids.length === 0) return null;

    const axis = depth % 2; // Alternate between x (0) and y (1) axis

    // Sort boids by the current axis and choose the median as the root
    boids.sort((a, b) => (axis === 0 ? a.x - b.x : a.y - b.y));
    const medianIndex = Math.floor(boids.length / 2);
    const medianBoid = boids[medianIndex];

    // Create the node and recursively build the left and right subtrees
    const node = new KDTreeNode(medianBoid, axis);
    node.left = this.buildTree(boids.slice(0, medianIndex), depth + 1);
    node.right = this.buildTree(boids.slice(medianIndex + 1), depth + 1);

    return node;
  }

  // Helper function to calculate squared distance between two boids
  squaredDistance(boid1, boid2) {
    return (boid1.x - boid2.x) ** 2 + (boid1.y - boid2.y) ** 2;
  }

  // Function to find all boids within a certain radius from the target boid
  searchRadius(node, targetBoid, radius, depth = 0, results = []) {
    if (!node) return results;

    const axis = node.axis;
    const distSquared = this.squaredDistance(node.boid, targetBoid);
    const radiusSquared = radius ** 2;

    // If the node is within the radius, add it to the results
    if (distSquared <= radiusSquared) {
      results.push(node.boid); // Store the entire boid object
    }

    // Determine which side(s) to search
    const diff =
      axis === 0 ? targetBoid.x - node.boid.x : targetBoid.y - node.boid.y;

    if (diff <= 0) {
      // Search left subtree
      this.searchRadius(node.left, targetBoid, radius, depth + 1, results);
      if (diff ** 2 < radiusSquared) {
        // Also search the right subtree if necessary
        this.searchRadius(node.right, targetBoid, radius, depth + 1, results);
      }
    } else {
      // Search right subtree
      this.searchRadius(node.right, targetBoid, radius, depth + 1, results);
      if (diff ** 2 < radiusSquared) {
        // Also search the left subtree if necessary
        this.searchRadius(node.left, targetBoid, radius, depth + 1, results);
      }
    }

    return results;
  }

  // Public method to search within a given radius
  rangeSearch(targetBoid, radius) {
    return this.searchRadius(this.root, targetBoid, radius);
  }
}

export default KDTree;
