import React, { Component } from "react";
import { Shaders, Node, GLSL } from "gl-react";
import { Surface } from "gl-react-dom";
import { Button } from 'antd'
import { Input } from 'antd'
import { Text } from 'antd'
import { get } from "node_modules/core-js/internals/internal-state";

const shaders = Shaders.create({
  paint: {
    frag: GLSL`

    precision highp float;
    varying vec2 uv;
    
    uniform float time;
    uniform int drawing_mode;
    uniform vec2 point1;
    uniform vec2 point2;
    uniform vec2 point3;
    uniform vec2 point4;
    uniform vec4 color;
    uniform float line_width;
    uniform float width;
    uniform float height;

    void main() {

    //triangle
    if(drawing_mode==1){
      vec2 line1 = point2-point1;
      vec2 line2 = point3-point2;
      vec2 line3 = point1-point3;
      vec2 line1_t = vec2(line1.x*width,line1.y*height);
      vec2 line2_t = vec2(line2.x*width,line2.y*height);
      vec2 line3_t = vec2(line3.x*width,line3.y*height);
      if((uv-point1).x*line1.y-(uv-point1).y*line1.x>0.0 && (uv-point2).x*line2.y-(uv-point2).y*line2.x>0.0 && (uv-point3).x*line3.y-(uv-point3).y*line3.x>0.0){
        if(((uv-point1).x*line1.y-(uv-point1).y*line1.x)*width*height/length(line1_t)<line_width || ((uv-point2).x*line2.y-(uv-point2).y*line2.x)*width*height/length(line2_t)<line_width || ((uv-point3).x*line3.y-(uv-point3).y*line3.x)*width*height/length(line3_t)<line_width){
          gl_FragColor = color;
        }
        else{
          discard;
        }
      }
      else{
        discard;
      }
    }
    //rectangle
    else if(drawing_mode==2){
      vec2 line1 = point2-point1;
      vec2 line2 = point3-point2;
      vec2 line3 = point4-point3;
      vec2 line4 = point1-point4;
      if((uv-point1).x*line1.y-(uv-point1).y*line1.x>0.0 && (uv-point2).x*line2.y-(uv-point2).y*line2.x>0.0 && (uv-point3).x*line3.y-(uv-point3).y*line3.x>0.0 && (uv-point4).x*line4.y-(uv-point4).y*line4.x>0.0){
        gl_FragColor = color;
      }
      else{
        discard;
      }
    }
    else {
      discard;
    }
    

    }
` }
});



export default class Example extends Component {
  state = {
    drawing_mode: 0,
    point1: [0.5, 0.5],
    point2: [0.4, 0.3],
    point3: [0.4, 0.7],
    point4: [0, 0],
    color: [1, 0, 0, 1],
    input_color: [0, 0, 0, 1],
    line_width: 1,
    width: 220,
    height: 160,
    cnt: 0,
  };

  render() {

    return (
      <>
        <Surface
          width={this.state.width}
          height={this.state.height}
          webglContextAttributes={{ preserveDrawingBuffer: true }}
          style={{ cursor: "crosshair" }}
        >
          <Node
            shader={shaders.paint}
            clear={null}
            uniforms={this.state}
          />

        </Surface>
        <Button
          onClick={() => {
            const col = [16. / 255, 62. / 255, 140./255, 1];
            if (this.state.cnt == 0) {
              this.setState({
                cnt: 1,
              });
              this.drawTriangle({ x: 110, y: 80 - 60 / Math.sqrt(3) }, { x: 110 - 30, y: 80 + 30 / Math.sqrt(3) }, { x: 110 + 30, y: 80 + 30 / Math.sqrt(3) }, col, 3);
            }
            if (this.state.cnt == 1) {
              this.setState({
                cnt: 2,
              });
              this.drawTriangle({ x: 110, y: 80 + 60 / Math.sqrt(3) }, { x: 110 +30, y: 80 - 30 / Math.sqrt(3) }, { x: 110 - 30, y: 80 - 30 / Math.sqrt(3) }, col, 3);
            }
            if (this.state.cnt == 2) {
              this.setState({
                cnt: 3
              });
              this.drawRectangle({ x: 0, y: 15 }, { x: 0, y: 40 }, { x: 220, y: 40 }, { x: 220, y: 15 }, col);
            }
            if (this.state.cnt == 3) {
              this.setState({
                cnt: 4,
              });
              this.drawRectangle({ x: 0, y: 160 - 40 }, { x: 0, y: 160 - 15 }, { x: 220, y: 160 - 15 }, { x: 220, y: 160 - 40 }, col);
            }
            if (this.state.cnt == 4) {
              this.setState({
                cnt: 0,
              });
              this.drawRectangle({ x: 0, y: 0 }, { x: 0, y: this.state.height }, { x: this.state.width, y: this.state.height }, { x: this.state.width, y: 0 }, [1, 1, 1, 1]);

              console.log(this.state);
            }
          }}
        >
          drawFlag{this.state.cnt}
        </Button>
        {this.state.cnt}
      </>
    );

  }

  drawTriangle = (p1, p2, p3, color, line_width) => {
    this.setState({
      drawing_mode: 1,
      point1: [p1.x / this.state.width, p1.y / this.state.height],
      point2: [p2.x / this.state.width, p2.y / this.state.height],
      point3: [p3.x / this.state.width, p3.y / this.state.height],
      color: color,
      line_width: line_width,
    });
    console.log(this.state);
    setTimeout(() => {
      this.setState({
        drawing_mode: 0,
      });
    }, 1000);
  }

  drawRectangle = (p1, p2, p3, p4, color) => {
    this.setState({
      drawing_mode: 2,
      point1: [p1.x / this.state.width, p1.y / this.state.height],
      point2: [p2.x / this.state.width, p2.y / this.state.height],
      point3: [p3.x / this.state.width, p3.y / this.state.height],
      point4: [p4.x / this.state.width, p4.y / this.state.height],
      color: color,
    });
    console.log(this.state);
    setTimeout(() => {
      this.setState({
        drawing_mode: 0,
      });
    }, 1000);
  }

}