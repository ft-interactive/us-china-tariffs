export default function spaceNodesApart(array, distance, alpha, range) {
  array.forEach((node) => {
    const nameA = node.name;
    const posA = node.time;
    array.forEach((nodeCompare) => {
      const nameB = nodeCompare.name;
      if (nameA !== nameB) {
        const posB = nodeCompare.time;
        const delta = posA - posB;

        if (Math.abs(delta) < distance) {
          const sign = delta > 0 ? 1 : -1;
          const adjust = sign * alpha;
          node.time = Math.min(Math.max(posA + adjust, range[0]), range[1]);
          nodeCompare.time = Math.min(Math.max(posB - adjust, range[0]), range[1]);

          spaceNodesApart(array, distance, alpha, range);
        }
      }
    });
  });
}
