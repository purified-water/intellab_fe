export const testMD = `
# Merge Sorted Array

## Problem Description

You are given two integer arrays \`nums1\` and \`nums2\`, **sorted in non-decreasing order**, and two integers \`m\` and \`n\`, representing the number of elements in \`nums1\` and \`nums2\` respectively.

**Merge** \`nums1\` and \`nums2\` into a single array sorted in non-decreasing order.

The final sorted array should not be returned by the function, but instead be _stored_ inside the array \`nums1\`. To accommodate this, \`nums1\` has a length of \`m + n\`, where the first \`m\` elements denote the elements that should be merged, and the last \`n\` elements are set to 0 and should be ignored. \`nums2\` has a length of \`n\`.

## Input

- An integer array \`nums1\` of length \`m + n\`.
- An integer \`m\` representing the number of elements in \`nums1\`.
- An integer array \`nums2\` of length \`n\`.
- An integer \`n\` representing the number of elements in \`nums2\`.

## Output

- A merged array sorted in non-decreasing order, stored inside \`nums1\`.

## Example

\`\`\`markdown
### Example 1

**Input:** nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3  
**Output:** [1,2,2,3,5,6]

### Example 2

**Input:** nums1 = [1], m = 1, nums2 = [], n = 0  
**Output:** [1]

### Example 3

**Input:** nums1 = [0], m = 0, nums2 = [1], n = 1  
**Output:** [1]
\`\`\`

## Constraints

- \`0 <= m, n <= 10^4\`
- \`nums1.length == m + n\`
- \`nums2.length == n\`
- \`-10^9 <= nums1[i], nums2[i] <= 10^9\`
`;
