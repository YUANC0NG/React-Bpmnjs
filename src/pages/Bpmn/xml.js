export default `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:activiti="http://activiti.org/bpmn" targetNamespace="http://www.activiti.org/processdef">
  <process id="leaveProcess" name="请输入流程名称" isExecutable="true">
    <documentation>请输入流程名称</documentation>
    <startEvent id="startEvent1" name="开始" />
    <userTask id="sid-ECFF0245-6D4D-44D8-9DB7-861D99A42272" approvalType="user" approvalValue="$INITIATOR" name="输入名称" activiti:assignee="$INITIATOR">
      <extensionElements>
        <modeler:activiti-idm-initiator xmlns:modeler="http://activiti.com/modeler">true</modeler:activiti-idm-initiator>
      </extensionElements>
    </userTask>
    <endEvent id="sid-07A2CB79-E1C9-48BC-8C8D-0AA058ADAA24" name="结束" />
    <sequenceFlow id="sid-F5C3F57A-EFA0-4E39-98B4-B1D4FEC5659E" sourceRef="startEvent1" targetRef="sid-ECFF0245-6D4D-44D8-9DB7-861D99A42272" />
    <sequenceFlow id="sid-83C2288C-D64C-468D-B2F2-A6D216C08119" sourceRef="sid-ECFF0245-6D4D-44D8-9DB7-861D99A42272" targetRef="sid-07A2CB79-E1C9-48BC-8C8D-0AA058ADAA24" />
  </process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_leaveProcess">
    <bpmndi:BPMNPlane id="BPMNPlane_leaveProcess" bpmnElement="leaveProcess">
      <bpmndi:BPMNEdge id="BPMNEdge_sid-83C2288C-D64C-468D-B2F2-A6D216C08119" bpmnElement="sid-83C2288C-D64C-468D-B2F2-A6D216C08119">
        <omgdi:waypoint x="500" y="315" />
        <omgdi:waypoint x="500" y="400" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="BPMNEdge_sid-F5C3F57A-EFA0-4E39-98B4-B1D4FEC5659E" bpmnElement="sid-F5C3F57A-EFA0-4E39-98B4-B1D4FEC5659E">
        <omgdi:waypoint x="500" y="160" />
        <omgdi:waypoint x="500" y="235" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="BPMNShape_startEvent1" bpmnElement="startEvent1">
        <omgdc:Bounds x="485" y="130" width="30" height="30" />
        <bpmndi:BPMNLabel>
          <omgdc:Bounds x="489" y="100" width="22" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="BPMNShape_sid-ECFF0245-6D4D-44D8-9DB7-861D99A42272" bpmnElement="sid-ECFF0245-6D4D-44D8-9DB7-861D99A42272">
        <omgdc:Bounds x="450" y="235" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="BPMNShape_sid-07A2CB79-E1C9-48BC-8C8D-0AA058ADAA24" bpmnElement="sid-07A2CB79-E1C9-48BC-8C8D-0AA058ADAA24">
        <omgdc:Bounds x="486" y="400" width="28" height="28" />
        <bpmndi:BPMNLabel>
          <omgdc:Bounds x="489" y="443" width="22" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</definitions>`;
