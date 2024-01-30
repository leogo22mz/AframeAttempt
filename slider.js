/* global AFRAME, THREE */
AFRAME.registerComponent("slider", {
    schema: {
        width: { default: 0.5 },
    },

    init: function () {
        var trackEl = (this.trackEl = document.createElement("a-entity"));
        this.localPosition = new THREE.Vector3();
        this.onPinchedMoved = this.onPinchedMoved.bind(this);
        this.onGrabbedMoved = this.onGrabbedMoved.bind(this);

        trackEl.setAttribute("geometry", {
            primitive: "box",
            height: 0.00,
            width: this.data.width,
            depth: 0.00,
        });

        trackEl.setAttribute("material", {
            color: "white",
        });

        this.el.appendChild(trackEl);

        var pickerEl = (this.pickerEl = document.createElement("a-entity"));

        pickerEl.setAttribute("geometry", {
            primitive: "sphere",
            radius: 0.08,
        });

        pickerEl.setAttribute("material", {
            color: "#3a50c5",
        });

        pickerEl.setAttribute("pinchable", {
            pinchDistance: 0.05,
        });

        pickerEl.setAttribute("rotation", {
            x: 90,
            y: 0,
            z: 0,
        });

        pickerEl.setAttribute("color-change", "");

        this.el.appendChild(pickerEl);

        pickerEl.addEventListener("pinchedmoved", this.onPinchedMoved);
        pickerEl.addEventListener("grabbedmoved", this.onGrabbedMoved);
    },

    onPinchedMoved: function(evt) {
        var el = this.el;
        var localPosition = new THREE.Vector3();
      
        localPosition.copy(evt.detail.position);
      
        el.object3D.updateMatrixWorld();
      
        el.object3D.worldToLocal(localPosition);
      
        this.pickerEl.object3D.position.set(localPosition.x, localPosition.y, localPosition.z);
      
        var evtDetail = {
          x: localPosition.x,
          y: localPosition.y,
          z: localPosition.z
        };
        this.el.emit('sliderchanged', evtDetail);
      },

    onGrabbedMoved: function (evt) {
        var el = this.el;
        var evtDetail = this.evtDetail;
        var halfWidth = this.data.width / 2;
        var localPosition = this.localPosition;
        localPosition.copy(evt.detail.position);
        el.object3D.updateMatrixWorld();
        el.object3D.worldToLocal(localPosition);
        if (localPosition.x < -halfWidth || localPosition.x > halfWidth) {
            return;
        }
        this.pickerEl.object3D.position.x = localPosition.x;
        evtDetail.value = (this.pickerEl.object3D.position.x + halfWidth) / this.data.width;
        this.el.emit("sliderchanged", evtDetail);
    },
});
