import { updateStatus } from '../network/gtkController';

const ROOT_KEY = '_ROOT_';

const restrictedProps = ['id', 'type', 'children'];

const GtkComponent = {
    createElement(tag, props, rootContainerElement/* , hostContext */) {
        return Object.assign({ [ROOT_KEY]: rootContainerElement }, props);
    },

    setInitialProperties(element, tag, rawProps/* , rootContainerElement */) {
        Object.assign(element, rawProps);

        if (tag === 'widget') {
            updateStatus(rawProps);
        }
    },

    diffProperties(/* element, tag, lastRawProps , nextRawProps, rootContainerElement */) {

    },

    updateProperties(element, updatePayload, type, oldProps, newProps) {
        const updatedProps = {};

        Object.keys(newProps).forEach((propName) => {
            if (oldProps[propName] !== newProps[propName]) {
                updatedProps[propName] = newProps[propName];
            }

            if (restrictedProps.includes(propName)) {
                updatedProps[propName] = newProps[propName];
            }
        });

        if (type === 'device') {
            updateStatus(updatedProps);
        }
    },
};

export default GtkComponent;

