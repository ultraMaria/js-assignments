'use strict';

/**
 * Returns the array of 32 compass points and heading.
 * See details here:
 * https://en.wikipedia.org/wiki/Points_of_the_compass#32_cardinal_points
 *
 * @return {array}
 *
 * Example of return :
 *  [
 *     { abbreviation : 'N',     azimuth : 0.00 ,
 *     { abbreviation : 'NbE',   azimuth : 11.25 },
 *     { abbreviation : 'NNE',   azimuth : 22.50 },
 *       ...
 *     { abbreviation : 'NbW',   azimuth : 348.75 }
 *  ]
 */
function createCompassPoints() {
    const directions = [
        'N', 'NbE', 'NNE', 'NEbN', 'NE', 'NEbE', 'ENE', 'EbN',
        'E', 'EbS', 'ESE', 'SEbE', 'SE', 'SEbS', 'SSE', 'SbE',
        'S', 'SbW', 'SSW', 'SWbS', 'SW', 'SWbW', 'WSW', 'WbS',
        'W', 'WbN', 'WNW', 'NWbW', 'NW', 'NWbN', 'NNW', 'NbW'
    ];
    
    const compassPoints = directions.map((dir, index) => ({
        abbreviation: dir,
        azimuth: index * 11.25
    }));
    
    return compassPoints;
}



/**
 * Expand the braces of the specified string.
 * See https://en.wikipedia.org/wiki/Bash_(Unix_shell)#Brace_expansion
 *
 * In the input string, balanced pairs of braces containing comma-separated substrings
 * represent alternations that specify multiple alternatives which are to appear at that position in the output.
 *
 * @param {string} str
 * @return {Iterable.<string>}
 *
 * NOTE: The order of output string does not matter.
 *
 * Example:
 *   '~/{Downloads,Pictures}/*.{jpg,gif,png}'  => '~/Downloads/*.jpg',
 *                                                '~/Downloads/*.gif'
 *                                                '~/Downloads/*.png',
 *                                                '~/Pictures/*.jpg',
 *                                                '~/Pictures/*.gif',
 *                                                '~/Pictures/*.png'
 *
 *   'It{{em,alic}iz,erat}e{d,}, please.'  => 'Itemized, please.',
 *                                            'Itemize, please.',
 *                                            'Italicized, please.',
 *                                            'Italicize, please.',
 *                                            'Iterated, please.',
 *                                            'Iterate, please.'
 *
 *   'thumbnail.{png,jp{e,}g}'  => 'thumbnail.png'
 *                                 'thumbnail.jpeg'
 *                                 'thumbnail.jpg'
 *
 *   'nothing to do' => 'nothing to do'
 */
function* expandBraces(str) {
    // Helper function to find the matching closing brace
    function findMatchingCloseBrace(str, start) {
        let count = 1;
        for (let i = start + 1; i < str.length; i++) {
            if (str[i] === '{') count++;
            else if (str[i] === '}') count--;
            if (count === 0) return i;
        }
        return -1; // No matching closing brace
    }

    // Helper function to split alternatives inside braces
    function splitAlternatives(str) {
        const alternatives = [];
        let start = 0;
        let depth = 0;
        for (let i = 0; i < str.length; i++) {
            if (str[i] === '{') depth++;
            else if (str[i] === '}') depth--;
            else if (str[i] === ',' && depth === 0) {
                alternatives.push(str.slice(start, i));
                start = i + 1;
            }
        }
        // Add the last alternative (even if it's an empty string)
        alternatives.push(str.slice(start));
        return alternatives;
    }

    // Recursive function to expand braces
    function* expand(str) {
        const braceStart = str.indexOf('{');
        if (braceStart === -1) {
            yield str; // No braces, return the string as is
            return;
        }

        const braceEnd = findMatchingCloseBrace(str, braceStart);
        if (braceEnd === -1) {
            yield str; // Invalid braces, return the string as is
            return;
        }

        const prefix = str.slice(0, braceStart);
        const suffix = str.slice(braceEnd + 1);
        const alternatives = splitAlternatives(str.slice(braceStart + 1, braceEnd));

        for (const alt of alternatives) {
            for (const expandedAlt of expand(alt)) {
                for (const result of expand(prefix + expandedAlt + suffix)) {
                    yield result;
                }
            }
        }
    }

    // Use a Set to avoid duplicate results
    const results = new Set();
    for (const result of expand(str)) {
        results.add(result);
    }

    // Yield the results in sorted order (to match the test case)
    const sortedResults = Array.from(results).sort();
    for (const result of sortedResults) {
        yield result;
    }
}


/**
 * Returns the ZigZag matrix
 *
 * The fundamental idea in the JPEG compression algorithm is to sort coefficient of given image by zigzag path and encode it.
 * In this task you are asked to implement a simple method to create a zigzag square matrix.
 * See details at https://en.wikipedia.org/wiki/JPEG#Entropy_coding
 * and zigzag path here: https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/JPEG_ZigZag.svg/220px-JPEG_ZigZag.svg.png
 *
 * @param {number} n - matrix dimension
 * @return {array}  n x n array of zigzag path
 *
 * @example
 *   1  => [[0]]
 *
 *   2  => [[ 0, 1 ],
 *          [ 2, 3 ]]
 *
 *         [[ 0, 1, 5 ],
 *   3  =>  [ 2, 4, 6 ],
 *          [ 3, 7, 8 ]]
 *
 *         [[ 0, 1, 5, 6 ],
 *   4 =>   [ 2, 4, 7,12 ],
 *          [ 3, 8,11,13 ],
 *          [ 9,10,14,15 ]]
 *
 */
function getZigZagMatrix(n) {
    const matrix = new Array(n);
    for (let i = 0; i < n; i++) {
        matrix[i] = new Array(n).fill(0);
    }

    let num = 0;
    let row = 0, col = 0;

    for (let i = 0; i < n * n; i++) {
        matrix[row][col] = num++;
        if ((row + col) % 2 === 0) {
            if (col === n - 1) {
                row++;
            } else if (row === 0) {
                col++;
            } else {
                row--;
                col++;
            }
        } else {
            if (row === n - 1) {
                col++;
            } else if (col === 0) {
                row++; 
            } else {
                row++;
                col--;
            }
        }
    }

    return matrix;
}


/**
 * Returns true if specified subset of dominoes can be placed in a row accroding to the game rules.
 * Dominoes details see at: https://en.wikipedia.org/wiki/Dominoes
 *
 * Each domino tile presented as an array [x,y] of tile value.
 * For example, the subset [1, 1], [2, 2], [1, 2] can be arranged in a row (as [1, 1] followed by [1, 2] followed by [2, 2]),
 * while the subset [1, 1], [0, 3], [1, 4] can not be arranged in one row.
 * NOTE that as in usual dominoes playing any pair [i, j] can also be treated as [j, i].
 *
 * @params {array} dominoes
 * @return {bool}
 *
 * @example
 *
 * [[0,1],  [1,1]] => true
 * [[1,1], [2,2], [1,5], [5,6], [6,3]] => false
 * [[1,3], [2,3], [1,4], [2,4], [1,5], [2,5]]  => true
 * [[0,0], [0,1], [1,1], [0,2], [1,2], [2,2], [0,3], [1,3], [2,3], [3,3]] => false
 *
 */
function canDominoesMakeRow(dominoes) {
    // Count the occurrences of each number on the dominoes
    const countMap = {};
    for (let [a, b] of dominoes) {
        countMap[a] = (countMap[a] || 0) + 1;
        countMap[b] = (countMap[b] || 0) + 1;
    }

    // Check how many numbers have an odd frequency
    let oddCount = 0;
    for (let count of Object.values(countMap)) {
        if (count % 2 !== 0) {
            oddCount++;
        }
    }

    // There can be at most two odd occurrences for a valid arrangement
    if (oddCount > 2) {
        return false;
    }

    // To check connectivity, we'll use a DFS/BFS approach
    const adjList = {};
    const visited = new Set();

    // Build an adjacency list representing the graph of domino connections
    for (let [a, b] of dominoes) {
        if (!adjList[a]) adjList[a] = [];
        if (!adjList[b]) adjList[b] = [];
        adjList[a].push(b);
        adjList[b].push(a);
    }

    // DFS to check if the dominoes are connected
    function dfs(node) {
        visited.add(node);
        for (let neighbor of adjList[node]) {
            if (!visited.has(neighbor)) {
                dfs(neighbor);
            }
        }
    }

    // Start DFS from the first node in the domino set
    dfs(dominoes[0][0]);

    // Check if all the numbers that appear in the dominoes are connected
    for (let [a, b] of dominoes) {
        if (!visited.has(a) || !visited.has(b)) {
            return false;
        }
    }

    return true;
}



/**
 * Returns the string expression of the specified ordered list of integers.
 *
 * A format for expressing an ordered list of integers is to use a comma separated list of either:
 *   - individual integers
 *   - or a range of integers denoted by the starting integer separated from the end integer in the range by a dash, '-'.
 *     (The range includes all integers in the interval including both endpoints)
 *     The range syntax is to be used only for, and for every range that expands to more than two values.
 *
 * @params {array} nums
 * @return {bool}
 *
 * @example
 *
 * [ 0, 1, 2, 3, 4, 5 ]   => '0-5'
 * [ 1, 4, 5 ]            => '1,4,5'
 * [ 0, 1, 2, 5, 7, 8, 9] => '0-2,5,7-9'
 * [ 1, 2, 4, 5]          => '1,2,4,5'
 */
function extractRanges(nums) {
    if (nums.length === 0) return '';

    let result = [];
    let start = nums[0]; // The first number in the current range
    let end = nums[0];   // The last number in the current range

    for (let i = 1; i <= nums.length; i++) {
        if (nums[i] === end + 1) {
            // If the current number is consecutive, extend the range
            end = nums[i];
        } else {
            // If the sequence breaks, process the previous range
            if (end - start >= 2) {
                result.push(`${start}-${end}`);
            } else {
                // If the range has less than 3 numbers, include them individually
                for (let j = start; j <= end; j++) {
                    result.push(j.toString());
                }
            }

            // Reset the range
            start = nums[i];
            end = nums[i];
        }
    }

    return result.join(',');
}


module.exports = {
    createCompassPoints : createCompassPoints,
    expandBraces : expandBraces,
    getZigZagMatrix : getZigZagMatrix,
    canDominoesMakeRow : canDominoesMakeRow,
    extractRanges : extractRanges
};
