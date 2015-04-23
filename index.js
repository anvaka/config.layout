/**
 * Controls physics engine settings, like spring length, drag coefficient, etc.
 *
 * @param {ngraph.pixel} renderer instance which is performing the renderer
 * @param {dat.gui} gui instance which shows configuration interface
 */
module.exports = addLayoutSettings;

function addLayoutSettings(renderer, gui) {
  var model = createLayoutModel(renderer);
  // Maybe in future localization will bite you, anvaka...
  // -- Your friend from the past, you
  var folder = gui.addFolder('Layout Settings');

  folder.add(model, 'springLength', 0, 1000).onChange(setSimulatorOption('springLength'));
  folder.add(model, 'springCoeff', 0, 0.1).onChange(setSimulatorOption('springCoeff'));
  folder.add(model, 'gravity', -50, 0).onChange(setSimulatorOption('gravity'));
  folder.add(model, 'theta', 0, 2).onChange(setSimulatorOption('theta'));
  folder.add(model, 'dragCoeff', 0, 1).onChange(setSimulatorOption('dragCoeff'));
  folder.add(model, 'timeStep', 1, 100).onChange(setSimulatorOption('timeStep'));

  function setSimulatorOption(optionName) {
    return function() {
      // we need to call this every time, since renderer can update layout at any time
      var layout = renderer.layout();
      var simulator = layout.simulator;
      simulator[optionName](model[optionName]);
      renderer.stable(false);
      renderer.focus();
    };
  }

  function createLayoutModel(renderer) {
    if (!renderer) throw new Error('Renderer is required for configuration options');

    var layout = renderer.layout();
    if (!layout) throw new Error('Could not get layout instance from the renderer');

    var simulator = layout.simulator;
    if (!simulator) throw new Error('Simlator is not defined on this layout instance');

    return {
      springLength: simulator.springLength(),
      springCoeff: simulator.springCoeff(),
      gravity: simulator.gravity(),
      theta: simulator.theta(),
      dragCoeff: simulator.dragCoeff(),
      timeStep: simulator.timeStep()
    };
  }
}
