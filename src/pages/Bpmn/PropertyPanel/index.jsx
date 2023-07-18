import React, { Component } from "react";
import { Input, Radio, Select } from "antd";
import _ from "lodash";
import styles from "./index.less";

/** 属性面板 */
class PropertyPanel extends Component {
  /**
   * react v16.3版本后生命周期
   * A：Init    => constructor => getDerivedStateFromProps => render => componentDidMount
   * B: Update  => getDerivedStateFromProps => shoulComponentUpdate => render => getSnapshortBeforeUpdate => componentDidUpdate
   * C: Unmount => componentWillUnmount
   */
  constructor(props) {
    super(props);
    this.state = {
      users: [],                // 可选用户列表
      roles: [],                // 可选角色列表
      element: {},              // 节点事件对象
      elementInfo: {
                                // 节点属性信息
        id: "",                 // 节点id
        name: "",               // 节点名称
        $type: "",              // 节点类型
        approvalType: "user",   // 审批类型
        approvalValue: "",      // 审批人/角色
        FlowLineType: "normal", // 流程线属性类型（可设为默认或条件分支，或不设置）
      },
    };
  }
  componentDidMount() {
    // 1.初始化可选用户和角色列表
    this.initData();
    // 2.初始化监听事件和候选用户
    this.addEventListener();
  }

  /** 初始化可选用户和角色列表 */
  initData = () => {
    this.setState({
      // 1.初始化可选用户列表
      users: [
        { value: "ls@163.com", label: "李四" },
        { value: "zs@qq.com", label: "张三" },
        { value: "$INITIATOR", label: "发起人自己" },
      ],
      // 2.初始化可选角色列表
      roles: [
        { value: "to_review", label: "复核人" },
        { value: "rechecker", label: "审定人" },
      ],
    });
  };

  /** 添加节点事件监听 */
  addEventListener = () => {
    // 1.监听节点选中
    this.props.bpmn.on("selection.changed", (e) => {
      const element = e.newSelection[0];
      if (!element) return;
      const elementInfo = {
        ...element.businessObject,
        ...element.businessObject.$attrs,
      };
      // 选中时:保存任务节点 element 和任务节点信息 elementInfo
      this.setState({
        element,
        elementInfo,
      });
      console.log("选中", elementInfo);
    });

    //  2.监听节点属性变化
    this.props.bpmn.on("element.changed", (e) => {
      // 获取节点属性
      const { element } = e;
      if (!element) return;
      const oldElementInfo = this.state.elementInfo;
      const newElementInfo = {
        ...element.businessObject,
        ...element.businessObject.$attrs,
      };

      // 节点xml属性变化更新到state视图
      if (element.id === oldElementInfo.id) {
        this.setState({ elementInfo: newElementInfo });
      }
    });
  };

  /**
   * 编辑Xml节点颜色
   * @param {String} color 颜色
   */
  editColor = (color) => {
    const modeling = this.props.bpmn.get("modeling");
    const element = this.state.element;
    modeling.setColor(element, { fill: null, stroke: color });
    modeling.updateProperties(element, { color: color });
  };

  /**
   * 更新Xml节点名称
   * @param {Object} e 事件对象
   */
  updateLabel = (e) => {
    const newName = e.target.value;
    const modeling = this.props.bpmn.get("modeling");
    const { element } = this.state;
    modeling.updateLabel(element, newName);
  };

  /**
   * 更新xml节点属性
   * @param {Object} params 对象参数
   */
  updateProperties = (params) => {
    const modeling = this.props.bpmn.get("modeling");
    const element = this.state.element;
    modeling.updateProperties(element, params);
  };

  /**
   * 更新xml节点表达式
   * @param {Object}} e 事件对象
   */
  updateCondition = (e) => {
    const value = e.target.value;
    const modeling = this.props.bpmn.get("modeling");
    const element = this.state.element;
    modeling.updateProperties(element, {
      conditionExpression: this.props.bpmn
        .get("moddle")
        .create("bpmn:FormalExpression", { body: value }),
    });
  };

  // 更新流程线条属性类型
  updateFlowLineType = (value) => {
    // 条件分支
    if (value === "condition") {
      this.updateProperties({
        FlowLineType: value,
      });
    }
    // 默认分支
    else if (value === "default") {
      this.updateProperties({
        FlowLineType: "default",
        conditionExpression: null, // 清空条件表达式
      });
    }
    // 普通分支
    else {
      this.updateProperties({
        FlowLineType: "normal",
        conditionExpression: null, // 清空条件表达式
      });
    }
  };

  // @todo 属性面板
  render() {
    const { bpmn } = this.props;
    const { elementInfo, users, roles, approvalType } = this.state;
    /** 审批下拉框标题 */
    const approvalTitle =
      approvalType === "user" ? "选择审批人" : "选择审批角色";
    /** 审批人下拉框列表 */
    const approvalList = elementInfo.approvalType === "user" ? users : roles;
    /** 是否显示设置审批人选项 */
    const isShow = ["bpmn:Task", "bpmn:UserTask"].includes(elementInfo.$type);
    /** 是否显示表达式 */
    const isShowCondition =
      elementInfo.$type === "bpmn:SequenceFlow" ? true : false;
    /** 表达式内容 */
    const ConditionValue = _.get(elementInfo, "conditionExpression.body", "");
    console.log("ConditionValue :", ConditionValue);

    return (
      <div className={styles.PropertyPanel}>
        {/* 节点名称 */}
        <div className={styles.item}>
          <div className={styles.itemTitle}>节点名称</div>
          <Input
            placeholder="请输入节点名称"
            value={elementInfo.name}
            onChange={this.updateLabel}
          />
        </div>

        {/* 设置审批类型 */}
        {isShow && (
          <div className={styles.item}>
            <div className={styles.itemTitle}>审批人设置</div>
            <Radio.Group
              value={elementInfo.approvalType}
              onChange={(e) => {
                this.updateProperties({
                  approvalType: e.target.value,
                  approvalValue: "",
                });
              }}
            >
              <Radio value={"user"}>指定成员</Radio>
              <Radio value={"role"}>指定角色</Radio>
            </Radio.Group>
          </div>
        )}

        {/* 选择审批人或角色 */}
        {isShow && (
          <div className={styles.item}>
            <div className={styles.itemTitle}>{approvalTitle}</div>
            <Select
              showSearch
              style={{ width: "100%" }}
              placeholder={approvalTitle}
              value={elementInfo.approvalValue}
              onChange={(value) => {
                this.updateProperties({
                  approvalValue: value,
                  "activiti:assignee": value,
                });
              }}
            >
              {approvalList.map((i) => (
                <Select.Option key={i.value} value={i.value}>
                  {i.label}
                </Select.Option>
              ))}
            </Select>
          </div>
        )}

        {/* 流转条件 */}
        {isShowCondition && (
          <div className={styles.item}>
            <div className={styles.itemTitle}>流转条件</div>
            <Select
              showSearch
              style={{ width: "100%" }}
              placeholder={"流转条件"}
              value={elementInfo.FlowLineType || "normal"}
              onChange={this.updateFlowLineType}
            >
              {[
                { label: "普通流转路径", value: "normal" },
                { label: "默认流转路径", value: "default" },
                { label: "条件流转路径", value: "condition" },
              ].map((i) => (
                <Select.Option key={i.value} value={i.value}>
                  {i.label}
                </Select.Option>
              ))}
            </Select>
          </div>
        )}

        {/* 分支表达式 */}
        {isShowCondition && elementInfo.FlowLineType === "condition" && (
          <div className={styles.item}>
            <div className={styles.itemTitle}>分支表达式</div>
            <Input
              placeholder="请输入表达式"
              value={ConditionValue}
              onChange={this.updateCondition}
            />
          </div>
        )}
      </div>
    );
  }
}

export default PropertyPanel;
