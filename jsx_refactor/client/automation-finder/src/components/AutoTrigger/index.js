import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import ClickUpLogo from '../images/clickup-logo.jpeg';

import StatusCard from "../TriggerCards/status";
import DefaultCard from "../TriggerCards/default";
import AssigneeCard from "../TriggerCards/assignee";
import CustomFieldCard from "../TriggerCards/customField";
import PriorityCard from "../TriggerCards/priority";
import TagCard from "../TriggerCards/tag";
import TaskCreatedCard from "../TriggerCards/taskCreated";
import TaskTypeCard from "../TriggerCards/taskType";

import './style.css';

const Trigger = ({ automationObject }) => {
  const [triggerObject, setTriggerObject] = useState(automationObject);
  const [conditions, setConditions] = useState();
  const [triggerName, setTriggerName] = useState('');
  const [triggeredOn, setTriggeredOn] = useState('tasks or subtasks')

  const printAutomationTrigger = (type) => {
    switch (true) {
      case /status/.test(type):
        setTriggerName('Status changes');
        break;
      case /checklists_resolved/.test(type):
        setTriggerName('All checklists resolved');
        break;
      case /subtasks_resolved/.test(type):
        setTriggerName('All subtasks resolved');
        break;
      case /assignee/.test(type):
        setTriggerName('Assignee added');
        break;
      case /assignee_removed/.test(type):
        setTriggerName('Assignee removed');
        break;
      case /comment/.test(type):
        setTriggerName('Comment is added');
        break;
      case /cf_/.test(type):
        setTriggerName('Custom Field changes');
        break;
      case /on_due_date/.test(type):
        setTriggerName('Due date arrives');
        break;
      case /due date/.test(type):
        setTriggerName('Due date changes');
        break;
      case /added_to_subcategory/.test(type):
        setTriggerName('Existing task or subtask is added to this location');
        break;
      case /subcategory_id/.test(type):
        setTriggerName('Existing task or subtask is moved to this location');
        break;
      case /priority/.test(type):
        setTriggerName('Priority changes');
        break;
      case /on_start_date/.test(type):
        setTriggerName('Start date arrives');
        break;
      case /start_date/.test(type):
        setTriggerName('Start date changes');
        break;
      case /tag/.test(type):
        setTriggerName('Tag added');
        break;
      case /tag_removed/.test(type):
        setTriggerName('Tag removed');
        break;
      case /custom_type/.test(type):
        setTriggerName('Task type changes');
        break;
      case /task_created/.test(type):
        if (triggerObject?.trigger?.input?.trigger_on === "ALL") {
          setTriggerName('Task or subtask created');
        } else if (triggerObject?.trigger?.input?.trigger_on === "TASK") {
          setTriggeredOn('a task');
          setTriggerName('Task created');
        } else if (triggerObject?.trigger?.input?.trigger_on === "SUBTASK") {
          setTriggeredOn('a subtask');
          setTriggerName('Subtask created');
        }
        break;
      case /linked_task/.test(type):
        if (triggerObject?.trigger?.input?.trigger_on === "ALL") {
          setTriggerName('Task or subtask linked');
        } else if (triggerObject?.trigger?.input?.trigger_on === "TASK") {
          setTriggeredOn('a task');
          setTriggerName('Task linked');
        } else if (triggerObject?.trigger?.input?.trigger_on === "SUBTASK") {
          setTriggerName('Subtask linked');
          setTriggeredOn('a subtask');
        }
        break;
      case /unblocked/.test(type):
        if (triggerObject?.trigger?.input?.trigger_on === "ALL") {
          setTriggerName('Task or subtask unblocked');
        } else if (triggerObject?.trigger?.input?.trigger_on === "TASK") {
          setTriggeredOn('a task');
          setTriggerName('Task unblocked');
        } else if (triggerObject?.trigger?.input?.trigger_on === "SUBTASK") {
          setTriggeredOn('a subtask');
          setTriggerName('Subtask unblocked');
        }
        break;
      case /time_spent/.test(type):
        setTriggerName('Time tracked');
        break;
      default:
        setTriggerName('');
    }
  }

  useEffect(() => {
    console.log(triggerName)
  }, [triggerName])

  useEffect(() => {
    if (triggerObject) {
      printAutomationTrigger(triggerObject?.trigger?.type);
    }
  }, [triggerObject])

  return (
    <>
      <Card>
        <div className="trigger-header-container">
          <img
            src={ClickUpLogo}
            className="clickup-icon-light" />
          <div className="trigger-text-container">
            <h4>When</h4>
            <span className="trigger-text">
              {`This happens on ${triggeredOn}`}
            </span>
          </div>
        </div>
      </Card><br />

    {(() => {
      switch (triggerName) {
        case "Status changes":
          return <StatusCard triggerName={triggerName} cardDetails={triggerObject} />
          break;
        case "Assignee added":
          return <AssigneeCard triggerName={triggerName} cardDetails={triggerObject} />
          break;
        case "Assignee removed":
          return <AssigneeCard triggerName={triggerName} cardDetails={triggerObject} />
          break;
        case "Custom Field changes":
          return <CustomFieldCard triggerName={triggerName} cardDetails={triggerObject} />
          break;
        case "All checklists resolved":
          return <DefaultCard triggerName={triggerName} cardDetails={triggerObject} />
          break;
        case "All subtasks resolved":
          return <DefaultCard triggerName={triggerName} cardDetails={triggerObject} />
          break;
        case "Comment is added":
          return <DefaultCard triggerName={triggerName} cardDetails={triggerObject} />
          break;
        case "Due date arrives":
          return <DefaultCard triggerName={triggerName} cardDetails={triggerObject} />
          break;
        case "Due date changes":
          return <DefaultCard triggerName={triggerName} cardDetails={triggerObject} />
          break;
        case "Existing task or subtask is added to this location":
          return <DefaultCard triggerName={triggerName} cardDetails={triggerObject} />
          break;
        case "Existing task or subtask is moved to this location":
          return <DefaultCard triggerName={triggerName} cardDetails={triggerObject} />
          break;
        case "Start date arrives":
          return <DefaultCard triggerName={triggerName} cardDetails={triggerObject} />
          break;
        case "Start date changes":
          return <DefaultCard triggerName={triggerName} cardDetails={triggerObject} />
          break;
        case "Task or subtask linked":
          return <DefaultCard triggerName={triggerName} cardDetails={triggerObject} />
          break;
        case "Task linked":
          return <DefaultCard triggerName={triggerName} cardDetails={triggerObject} />
          break;
        case "Subtask linked":
          return <DefaultCard triggerName={triggerName} cardDetails={triggerObject} />
          break;
        case "Task or subtask unblocked":
          return <DefaultCard triggerName={triggerName} cardDetails={triggerObject} />
          break;
        case "Task unblocked":
          return <DefaultCard triggerName={triggerName} cardDetails={triggerObject} />
          break;
        case "Subtask unblocked":
          return <DefaultCard triggerName={triggerName} cardDetails={triggerObject} />
          break;
        case "Time tracked":
          return <DefaultCard triggerName={triggerName} cardDetails={triggerObject} />
          break;
        case "Priority changes":
          return <PriorityCard triggerName={triggerName} cardDetails={triggerObject} />
          break;
        case "Tag added":
          return <TagCard triggerName={triggerName} cardDetails={triggerObject} />
          break;
        case "Tag removed":
          return <TagCard triggerName={triggerName} cardDetails={triggerObject} />
          break;
        case "Task type changes":
          return <TaskTypeCard triggerName={triggerName} cardDetails={triggerObject} />
          break;
        case "Task or subtask created":
          return <TaskCreatedCard triggerName={triggerName} cardDetails={triggerObject} />
          break;
        case "Task created":
          return <TaskCreatedCard triggerName={triggerName} cardDetails={triggerObject} />
          break;
        case "Subtask created":
          return <TaskCreatedCard triggerName={triggerName} cardDetails={triggerObject} />
          break;
      }
    })()}
    </>
  )
};

export default Trigger;