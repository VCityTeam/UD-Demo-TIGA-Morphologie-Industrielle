// FeatureToolTip is a debug module from iTowns
// https://github.com/iTowns/itowns/blob/master/examples/js/plugins/FeatureToolTip.js
export class FeatureToolTip {
  constructor(viewerDiv, view) {
    this.tooltip = document.createElement('div');
    this.tooltip.className = 'tooltip';
    viewerDiv.appendChild(this.tooltip);

    this.view = view;
    this.layers = [];
    this.layersId = [];

    this.mouseDown = 0;
    document.body.addEventListener(
      'mousedown',
      function _() {
        ++this.mouseDown;
      },
      false
    );
    document.body.addEventListener(
      'mouseup',
      function _() {
        --this.mouseDown;
      },
      false
    );

    // Mouse movement listening
    function onMouseMove(event) {
      if (!this.mouseDown) {
        this.moveToolTip(event);
      } else {
        this.tooltip.style.left = this.view.eventToViewCoords(event).x + 'px';
        this.tooltip.style.top = this.view.eventToViewCoords(event).y + 'px';
      }
    }

    document.addEventListener('mousemove', onMouseMove.bind(this), false);
    document.addEventListener('mousedown', onMouseMove.bind(this), false);
  }

  moveToolTip(event) {
    const features = this.view.pickFeaturesAt(event, 3, ...this.layersId);

    let layer;
    let content = '';
    for (const layerId in features) {
      if (features[layerId].length == 0) {
        continue;
      }

      layer = this.layers[this.layersId.indexOf(layerId)];
      if (!layer || !layer.layer.visible) {
        continue;
      }
      if (typeof layer.options.filterGeometries == 'function') {
        features[layerId] =
          layer.options.filterGeometries(features[layerId], layer.layer) || [];
      }
      content += this.fillToolTip([features[layerId][0]], layer.options);
    }

    if (content != '') {
      this.tooltip.innerHTML = content;
      this.tooltip.style.display = 'block';
      this.tooltip.style.left = this.view.eventToViewCoords(event).x + 'px';
      this.tooltip.style.top = this.view.eventToViewCoords(event).y + 'px';
    } else {
      this.tooltip.style.display = 'none';
      this.tooltip.innerHTML = '';
    }
  }

  fillToolTip(features, options) {
    let content = '';
    let feature;
    let geometry;
    let prop;

    for (let p = 0; p < features.length; p++) {
      feature = features[p];
      geometry = feature.geometry;
      content += '<div>';

      if (geometry.properties) {
        for (prop in geometry.properties) {
          let filter = options.filterProperties.find((f) => {
            return f.name == prop;
          });
          if (filter) {
            let value =
              geometry.properties[prop] == null ? 0 : geometry.properties[prop];
            content += '<ul>' + filter.target + ': ' + value + '</ul>';
          }
        }
      }

      content += '</div>';
    }

    return content;
  }

  addLayer(layer, options) {
    if (!layer.isLayer) {
      return layer;
    }

    this.layers.push({ layer: layer, options: options });
    this.layersId.push(layer.id);

    return layer;
  }
}
