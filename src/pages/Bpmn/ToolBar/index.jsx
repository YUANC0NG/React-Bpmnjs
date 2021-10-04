import React, { Component } from 'react';
import styles from './index.less';
import "./index.less";

class BpmnToolBar extends Component {
    /**
     * react v16.3版本后生命周期
     * A：Init    => constructor => getDerivedStateFromProps => render => componentDidMount 
     * B: Update  => getDerivedStateFromProps => shoulComponentUpdate => render => getSnapshortBeforeUpdate => componentDidUpdate
     * C: Unmount => componentWillUnmount
     */
    constructor(props) {
        super(props);
        this.state = {
            scale: 1,    // 流程图比例
        };
    }

    /**
     * 下载xml/svg
     *  @param  type  类型  svg / xml
     *  @param  data  数据
     *  @param  name  文件名称
     */
    download = (type, data, name) => {
        let dataTrack = '';
        const a = document.createElement('a');
        switch (type) {
            case 'xml':
                dataTrack = 'bpmn';
                break;
            case 'svg':
                dataTrack = 'svg';
                break;
            default:
                break;
        }

        name = name || `diagram.${dataTrack}`;
        a.setAttribute('href', `data:application/bpmn20-xml;charset=UTF-8,${encodeURIComponent(data)}`);
        a.setAttribute('target', '_blank');
        a.setAttribute('dataTrack', `diagram:download-${dataTrack}`);
        a.setAttribute('download', name);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    /** 保存 */
    onSave = () => {
        this.props.bpmn.saveXML({ format: true }, (err, xml) => {
            console.log(xml);
        });
    };

    /** 前进 */
    onRedo = () => {
        this.props.bpmn.get('commandStack').redo();
    };

    /** 后退 */
    onUndo = () => {
        this.props.bpmn.get('commandStack').undo();
    };

    /** 导入xml文件 */
    onOpenFile = (e) => {
        const that = this;
        const file = e.target.files[0];
        console.log('file', file)
        const reader = new FileReader();
        let data = '';
        reader.readAsText(file);
        reader.onload = function (event) {
            data = event.target.result;
            that.renderDiagram(data, 'open');
        };
    };

    /** 渲染xml图 */
    renderDiagram = (xml) => {
        this.props.bpmn.importXML(xml, (err) => {
            if (err) {
                console.log('导入失败');
            } else {
                console.log('导入成功');
            }
        });
    };

    /** 流程图放大缩小 */
    onZoom = (radio) => {
        const newScale = !radio
            ? 1.0 // 不输入radio则还原
            : this.state.scale + radio <= 0.2 // 最小缩小倍数
                ? 0.2
                : this.state.scale + radio;

        this.props.bpmn.get('canvas').zoom(newScale);
        this.setState({
            scale: newScale
        });
    };

    /** 下载XML文件 */
    onDownloadXml = () => {
        this.props.bpmn.saveXML({ format: true }, (err, data) => {
            this.download('xml', data);
        });
    };

    /** 下载Svg图片 */
    onDownloadSvg = () => {
        this.props.bpmn.saveSVG({ format: true }, (err, data) => {
            this.download('svg', data);
        });
    };

    render() {
        return (
            <div className={styles.BpmnToolBar}>
                <ul className={styles.controlList}>
                    <li className={`${styles.control} ${styles.line}`}>
                        <input
                            ref={(file) => { this.file = file; }}
                            className={styles.openFile}
                            type="file"
                            onChange={this.onOpenFile}
                        />
                        <button type="button" title="open" onClick={() => { this.file.click(); }}>
                            <i className={styles.open} />
                        </button>
                    </li>

                    <li className={styles.control}>
                        <button type="button" title="撤销" onClick={this.onUndo}>
                            <i className={styles.undo} />
                        </button>
                    </li>

                    <li className={`${styles.control} ${styles.line}`}>
                        <button type="button" title="前进" onClick={this.onRedo}>
                            <i className={styles.redo} />
                        </button>
                    </li>

                    <li className={styles.control}>
                        <button type="button" title="重置大小" onClick={() => this.onZoom()}>
                            <i className={styles.zoom} />
                        </button>
                    </li>

                    <li className={styles.control}>
                        <button type="button" title="放大" onClick={() => { this.onZoom(0.1) }}>
                            <i className={styles.zoomIn} />
                        </button>
                    </li>

                    <li className={`${styles.control} ${styles.line}`}>
                        <button type="button" title="缩小" onClick={() => { this.onZoom(-0.1) }}>
                            <i className={styles.zoomOut} />
                        </button>
                    </li>

                    <li className={styles.control}>
                        <button type="button" title="保存" onClick={this.onSave}>
                            <i className={styles.save} />
                        </button>
                    </li>

                    <li className={styles.control}>
                        <button type="button" title="下载BPMN.XML文件" onClick={this.onDownloadXml}>
                            <i className={styles.download} />
                        </button>
                    </li>

                    <li className={styles.control}>
                        <button type="button" title="下载SVG图片" onClick={this.onDownloadSvg}>
                            <i className={styles.image} />
                        </button>
                    </li>
                </ul>
            </div>
        );
    };
}

export default BpmnToolBar;