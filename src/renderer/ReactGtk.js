// import { createElement } from '../utils/createElement';
import ReactGtkRenderer from './ReactGtkRenderer';
import '../devtools/setupDevtoolsFiber';

const createElement = (type, props) => ({
    type: 'ROOT',
    props,
});

/**
 * This function renders the component
 * @param {Object} element
 */

const ReactSmartDOM = {
    render(element) {
        const container = createElement('ROOT');

        const node = ReactGtkRenderer.createContainer(container);

        ReactGtkRenderer.injectIntoDevTools({
            bundleType: 1, // 0 for PROD, 1 for DEV
            version: '0.1.0', // version for your renderer
            rendererPackageName: 'react-smart-dom', // package name
            findHostInstanceByFiber: ReactGtkRenderer.findHostInstance, // host instance (root)
        });
        ReactGtkRenderer.updateContainer(element, node, null);
    },
};

/**
 * Required for testing the components
 */
export function testRenderer(element) {
    const container = createElement('ROOT');
    const node = ReactGtkRenderer.createContainer(container);

    ReactGtkRenderer.updateContainer(element, node, null);

    return container;
}

export default ReactSmartDOM;
