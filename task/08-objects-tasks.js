'use strict';

/**************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 **************************************************************************************************/


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    var r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
    this.width = width;
    this.height = height;
}
Rectangle.prototype.getArea = function() {
    return this.width * this.height;
};



/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
    return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    var r = fromJSON(Rectangle.prototype, '{"width":10, "height":20}');
 *
 */
function fromJSON(proto, json) {
    const parsedObject = JSON.parse(json);
    
    const obj = Object.create(proto);
    Object.assign(obj, parsedObject);
    return obj
}

/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy and implement the functionality
 * to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple, clear and readable as possible.
 *
 * @example
 *
 *  var builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()  => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()  => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()        =>    'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class CssSelector {
    constructor() {
        this.parts = [];
        this.order = ['element', 'id', 'class', 'attr', 'pseudoClass', 'pseudoElement'];
        this.occurrence = {
            element: false,
            id: false,
            pseudoElement: false,
        };
    }

    // Helper method to validate the order of selector parts
    _validateOrder(newPartType) {
        if (this.parts.length > 0) {
            const lastPartType = this.parts[this.parts.length - 1].type;
            const lastIndex = this.order.indexOf(lastPartType);
            const newIndex = this.order.indexOf(newPartType);

            if (newIndex < lastIndex) {
                throw new Error(
                    'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element'
                );
            }
        }
    }

    element(value) {
        if (this.occurrence.element) {
            throw new Error(
                'Element, id and pseudo-element should not occur more then one time inside the selector'
            );
        }
        this._validateOrder('element');
        this.occurrence.element = true;
        this.parts.push({ type: 'element', value });
        return this;
    }

    id(value) {
        if (this.occurrence.id) {
            throw new Error(
                'Element, id and pseudo-element should not occur more then one time inside the selector'
            );
        }
        this._validateOrder('id');
        this.occurrence.id = true;
        this.parts.push({ type: 'id', value });
        return this;
    }

    class(value) {
        this._validateOrder('class');
        this.parts.push({ type: 'class', value });
        return this;
    }

    attr(value) {
        this._validateOrder('attr');
        this.parts.push({ type: 'attr', value });
        return this;
    }

    pseudoClass(value) {
        this._validateOrder('pseudoClass');
        this.parts.push({ type: 'pseudoClass', value });
        return this;
    }

    pseudoElement(value) {
        if (this.occurrence.pseudoElement) {
            throw new Error(
                'Element, id and pseudo-element should not occur more then one time inside the selector'
            );
        }
        this._validateOrder('pseudoElement');
        this.occurrence.pseudoElement = true;
        this.parts.push({ type: 'pseudoElement', value });
        return this;
    }

    stringify() {
        return this.parts
            .map(part => {
                switch (part.type) {
                    case 'element':
                        return part.value;
                    case 'id':
                        return `#${part.value}`;
                    case 'class':
                        return `.${part.value}`;
                    case 'attr':
                        return `[${part.value}]`;
                    case 'pseudoClass':
                        return `:${part.value}`;
                    case 'pseudoElement':
                        return `::${part.value}`;
                    case 'combined':
                        return part.value;
                    case 'combinator':
                        return ` ${part.value} `;
                    default:
                        return '';
                }
            })
            .join('');
    }
}

const cssSelectorBuilder = {
    element: function(value) {
        return new CssSelector().element(value);
    },

    id: function(value) {
        return new CssSelector().id(value);
    },

    class: function(value) {
        return new CssSelector().class(value);
    },

    attr: function(value) {
        return new CssSelector().attr(value);
    },

    pseudoClass: function(value) {
        return new CssSelector().pseudoClass(value);
    },

    pseudoElement: function(value) {
        return new CssSelector().pseudoElement(value);
    },

    combine: function(selector1, combinator, selector2) {
        const combined = new CssSelector();
        combined.parts = [
            { type: 'combined', value: selector1.stringify() },
            { type: 'combinator', value: combinator },
            { type: 'combined', value: selector2.stringify() },
        ];
        return combined;
    },
};

module.exports = {
    Rectangle: Rectangle,
    getJSON: getJSON,
    fromJSON: fromJSON,
    cssSelectorBuilder: cssSelectorBuilder
};
