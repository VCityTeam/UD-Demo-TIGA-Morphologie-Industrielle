// FeatureToolTip is a debug module from iTowns
// https://github.com/iTowns/itowns/blob/master/examples/js/plugins/FeatureToolTip.js
import * as itowns from 'itowns';

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
    this.tooltip.innerHTML = '';
    this.tooltip.style.display = 'none';

    const features = this.view.pickFeaturesAt.apply(
      this.view,
      [event, 3].concat(this.layersId)
    );

    let layer;
    for (const layerId in features) {
      if (features[layerId].length == 0) {
        continue;
      }

      layer = this.layers[this.layersId.indexOf(layerId)];
      if (!layer) {
        continue;
      }
      if (typeof layer.options.filterGeometries == 'function') {
        features[layerId] =
          layer.options.filterGeometries(features[layerId], layer.layer) || [];
      }
      this.tooltip.innerHTML += this.fillToolTip(
        [features[layerId][0]],
        layer.options
      );
    }

    if (this.tooltip.innerHTML != '') {
      this.tooltip.style.display = 'block';
      this.tooltip.style.left = this.view.eventToViewCoords(event).x + 'px';
      this.tooltip.style.top = this.view.eventToViewCoords(event).y + 'px';
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

      if (geometry.properties && !options.filterAllProperties) {
        if (options.format) {
          for (prop in geometry.properties) {
            if (options.filterProperties.includes(prop)) {
              content += options.format(prop, geometry.properties[prop]) || '';
            }
          }
        } else {
          content += '<ul>';
          for (prop in geometry.properties) {
            if (options.filterProperties.includes(prop)) {
              content +=
                '<li>' + prop + ': ' + geometry.properties[prop] + '</li>';
            }
          }

          if (content.endsWith('<ul>')) {
            content = content.replace('<ul>', '');
          } else {
            content += '</ul>';
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

    const opts = options || { filterAllProperties: true };
    opts.filterProperties =
      opts.filterProperties === undefined ? [] : opts.filterProperties;

    this.layers.push({ layer: layer, options: opts });
    this.layersId.push(layer.id);

    return layer;
  }
}
