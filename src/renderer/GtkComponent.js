// import { updateStatus } from '../network/gtkController';
import { appendGtkChild, createGtkElement, updateGtkElement } from '../network/gtkConnection';

const ROOT_KEY = '_ROOT_';

const restrictedProps = ['id', 'type', 'children'];
let generalWidgetId = 1;

const GtkComponent = {
    createElement(tag, props, rootContainerElement/* , hostContext */) {
        console.log('createElement', props);
        const element = Object.assign({}, props, { _id: generalWidgetId });

        if (tag === 'widget') {
            createGtkElement(generalWidgetId, props);
        }

        generalWidgetId++;

        return element;
    },

    appendChild(parent, child) {
        console.log('appendChild: parent/child', parent._id, child._id);

        appendGtkChild(parent._id, child._id);
    },

    setInitialProperties(element, tag, rawProps/* , rootContainerElement */) {
        console.log('-==========\n\n');
        console.log('setInitialProperties');
        return Object.assign(element, rawProps);
    },

    diffProperties(/* element, tag, lastRawProps , nextRawProps, rootContainerElement */) {

    },

    updateProperties(element, updatePayload, type, oldProps, newProps) {
        const updatedProps = {};

        Object.keys(newProps).forEach((propName) => {
            if (!restrictedProps.includes(propName)) {
                updatedProps[propName] = newProps[propName];
            } else {
                return;
            }

            if (oldProps[propName] !== newProps[propName]) {
                updatedProps[propName] = newProps[propName];
            }

        });
        console.log('\n\n ====> updateProperties/element', element);
        console.log('\n\n ====> updatedProps', updatedProps);

        if (type === 'widget') {
            Object.keys(updatedProps).forEach(key => updateGtkElement(element._id, key, updatedProps[key]));
        }
    },
};

export default GtkComponent;

