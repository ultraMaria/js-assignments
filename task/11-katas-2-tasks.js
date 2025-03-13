'use strict';

/**
 * Returns the bank account number parsed from specified string.
 *
 * You work for a bank, which has recently purchased an ingenious machine to assist in reading letters and faxes sent in by branch offices.
 * The machine scans the paper documents, and produces a string with a bank account that looks like this:
 *
 *    _  _     _  _  _  _  _
 *  | _| _||_||_ |_   ||_||_|
 *  ||_  _|  | _||_|  ||_| _|
 *
 * Each string contains an account number written using pipes and underscores.
 * Each account number should have 9 digits, all of which should be in the range 0-9.
 *
 * Your task is to write a function that can take bank account string and parse it into actual account numbers.
 *
 * @param {string} bankAccount
 * @return {number}
 *
 * Example of return :
 *
 *   '    _  _     _  _  _  _  _ \n'+
 *   '  | _| _||_||_ |_   ||_||_|\n'+     =>  123456789
 *   '  ||_  _|  | _||_|  ||_| _|\n'
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '| | _| _|| ||_ |_   ||_||_|\n'+     => 23056789
 *   '|_||_  _||_| _||_|  ||_| _|\n',
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '|_| _| _||_||_ |_ |_||_||_|\n'+     => 823856989
 *   '|_||_  _||_| _||_| _||_| _|\n',
 *
 */
function parseBankAccount(bankAccount) {
    // Mapping of 3x3 blocks to digits
    const digitMap = {
        ' _ | ||_|': '0',
        '     |  |': '1',
        ' _  _||_ ': '2',
        ' _  _| _|': '3',
        '   |_|  |': '4',
        ' _ |_  _|': '5',
        ' _ |_ |_|': '6',
        ' _   |  |': '7',
        ' _ |_||_|': '8',
        ' _ |_| _|': '9'
    };

    // Remove extra spaces and split the bank account string into three lines
    const lines = bankAccount.split('\n').map(line => line.split('').join(''));

    // This will store the resulting bank account number as a string
    let accountNumber = '';

    // Iterate through each "digit" (3 columns at a time)
    for (let i = 0; i < lines[0].length; i += 3) {
        // Extract each 3x3 block (slice 3 characters from each line)
        const block = lines.map(line => line.slice(i, i + 3)).join('');

        // Find the corresponding digit for the block
        accountNumber += digitMap[block];
    }

    return parseInt(accountNumber, 10); // Convert to number and return
}



/**
 * Returns the string, but with line breaks inserted at just the right places to make sure that no line is longer than the specified column number.
 * Lines can be broken at word boundaries only.
 *
 * @param {string} text
 * @param {number} columns
 * @return {Iterable.<string>}
 *
 * @example :
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 26 =>  'The String global object',
 *                                                                                                'is a constructor for',
 *                                                                                                'strings, or a sequence of',
 *                                                                                                'characters.'
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 12 =>  'The String',
 *                                                                                                'global',
 *                                                                                                'object is a',
 *                                                                                                'constructor',
 *                                                                                                'for strings,',
 *                                                                                                'or a',
 *                                                                                                'sequence of',
 *                                                                                                'characters.'
 */
function* wrapText(text, columns) {
    // Step 1: Split the input text into words
    const words = text.split(' ');

    // Step 2: Initialize an empty line
    let currentLine = '';

    // Step 3: Iterate through the words
    for (const word of words) {
        // If the current line is empty, we can add the word directly
        if (currentLine.length === 0) {
            currentLine = word;
        } else {
            // If adding this word exceeds the column limit, yield the current line and start a new one
            if (currentLine.length + 1 + word.length > columns) {
                yield currentLine;
                currentLine = word; // Start a new line with the current word
            } else {
                // Otherwise, just add the word to the current line
                currentLine += ' ' + word;
            }
        }
    }

    // Step 4: Yield the remaining line (if any)
    if (currentLine) {
        yield currentLine;
    }
}


/**
 * Returns the rank of the specified poker hand.
 * See the ranking rules here: https://en.wikipedia.org/wiki/List_of_poker_hands.
 *
 * @param {array} hand
 * @return {PokerRank} rank
 *
 * @example
 *   [ '4♥','5♥','6♥','7♥','8♥' ] => PokerRank.StraightFlush
 *   [ 'A♠','4♠','3♠','5♠','2♠' ] => PokerRank.StraightFlush
 *   [ '4♣','4♦','4♥','4♠','10♥' ] => PokerRank.FourOfKind
 *   [ '4♣','4♦','5♦','5♠','5♥' ] => PokerRank.FullHouse
 *   [ '4♣','5♣','6♣','7♣','Q♣' ] => PokerRank.Flush
 *   [ '2♠','3♥','4♥','5♥','6♥' ] => PokerRank.Straight
 *   [ '2♥','4♦','5♥','A♦','3♠' ] => PokerRank.Straight
 *   [ '2♥','2♠','2♦','7♥','A♥' ] => PokerRank.ThreeOfKind
 *   [ '2♥','4♦','4♥','A♦','A♠' ] => PokerRank.TwoPairs
 *   [ '3♥','4♥','10♥','3♦','A♠' ] => PokerRank.OnePair
 *   [ 'A♥','K♥','Q♥','2♦','3♠' ] =>  PokerRank.HighCard
 */
const PokerRank = {
    StraightFlush: 8,
    FourOfKind: 7,
    FullHouse: 6,
    Flush: 5,
    Straight: 4,
    ThreeOfKind: 3,
    TwoPairs: 2,
    OnePair: 1,
    HighCard: 0
};

function getPokerHandRank(hand) {
    // Helper function to get the rank (value) of a card
    const rankValues = {
        '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
        '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14
    };

    // Helper function to check if the hand is a sequence (straight)
    function isStraight(ranks) {
        // Sort ranks in ascending order
        ranks = ranks.sort((a, b) => a - b);

        // Check for regular straight (e.g., 5,6,7,8,9)
        let isRegularStraight = true;
        for (let i = 1; i < ranks.length; i++) {
            if (ranks[i] !== ranks[i - 1] + 1) {
                isRegularStraight = false;
                break;
            }
        }

        // Check for low straight (A,2,3,4,5)
        const isLowStraight = JSON.stringify(ranks) === JSON.stringify([2, 3, 4, 5, 14]);

        return isRegularStraight || isLowStraight;
    }

    // Split hand into ranks and suits
    const ranks = hand.map(card => rankValues[card.slice(0, -1)]);
    const suits = hand.map(card => card.slice(-1));

    // Check if all cards are of the same suit (flush)
    const isFlush = suits.every(suit => suit === suits[0]);

    // Check for Straight
    const isStraightHand = isStraight(ranks);

    // Count occurrences of each rank
    const rankCount = {};
    for (let rank of ranks) {
        rankCount[rank] = (rankCount[rank] || 0) + 1;
    }
    const rankCounts = Object.values(rankCount).sort((a, b) => b - a);

    // Check hand rankings
    if (isFlush && isStraightHand) {
        return PokerRank.StraightFlush;
    } else if (rankCounts[0] === 4) {
        return PokerRank.FourOfKind;
    } else if (rankCounts[0] === 3 && rankCounts[1] === 2) {
        return PokerRank.FullHouse;
    } else if (isFlush) {
        return PokerRank.Flush;
    } else if (isStraightHand) {
        return PokerRank.Straight;
    } else if (rankCounts[0] === 3) {
        return PokerRank.ThreeOfKind;
    } else if (rankCounts[0] === 2 && rankCounts[1] === 2) {
        return PokerRank.TwoPairs;
    } else if (rankCounts[0] === 2) {
        return PokerRank.OnePair;
    } else {
        return PokerRank.HighCard;
    }
}

/**
 * Returns the rectangles sequence of specified figure.
 * The figure is ASCII multiline string comprised of minus signs -, plus signs +, vertical bars | and whitespaces.
 * The task is to break the figure in the rectangles it is made of.
 *
 * NOTE: The order of rectanles does not matter.
 * 
 * @param {string} figure
 * @return {Iterable.<string>} decomposition to basic parts
 * 
 * @example
 *
 *    '+------------+\n'+
 *    '|            |\n'+
 *    '|            |\n'+              '+------------+\n'+
 *    '|            |\n'+              '|            |\n'+         '+------+\n'+          '+-----+\n'+
 *    '+------+-----+\n'+       =>     '|            |\n'+     ,   '|      |\n'+     ,    '|     |\n'+
 *    '|      |     |\n'+              '|            |\n'+         '|      |\n'+          '|     |\n'+
 *    '|      |     |\n'               '+------------+\n'          '+------+\n'           '+-----+\n'
 *    '+------+-----+\n'
 *
 *
 *
 *    '   +-----+     \n'+
 *    '   |     |     \n'+                                    '+-------------+\n'+
 *    '+--+-----+----+\n'+              '+-----+\n'+          '|             |\n'+
 *    '|             |\n'+      =>      '|     |\n'+     ,    '|             |\n'+
 *    '|             |\n'+              '+-----+\n'           '+-------------+\n'
 *    '+-------------+\n'
 */
function* getFigureRectangles(figure) {
   throw new Error('Not implemented');
}


module.exports = {
    parseBankAccount : parseBankAccount,
    wrapText: wrapText,
    PokerRank: PokerRank,
    getPokerHandRank: getPokerHandRank,
    getFigureRectangles: getFigureRectangles
};
