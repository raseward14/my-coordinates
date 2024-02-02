import { useEffect, useState } from 'react';
import { Button } from "react-bootstrap"

import axios from 'axios';
import './style.css';

type AutomationPropList = {
  teamId: string;
  spaceIds: string[];
  folderIds: string[];
  listIds: string[];
  folderlessListIds: string[];
  token: string;
};

const Automations = (props: AutomationPropList) => {
  // sets dynamically by workspaceID on page load
  const [shard, setShard] = useState<string>('');
  const yourToken = localStorage.getItem('token');
  // this token could be passed as a prop
  // const [token, setToken] = useState<any>(props.token)
  const [token, setToken] = useState<any>(yourToken)

  // variables for the trigger being searched
  const [triggerId, setTriggerId] = useState<string>('');
  const [foundTrigger, setFoundTrigger] = useState<any>();
  const [shortcut, setShortcut] = useState<boolean>(false);
  
  // will be passed from workspace.tsx - IN PROGRESS
  // const [workspaceId, setWorkspaceId] = useState<string>(props.teamId || '18016766');
    // location ids
  // const [spaceIds, setSpaceIds] = useState<string[]>(props.spaceIds || ['30041784']);
  // const [folderIds, setFolderIds] = useState<string[]>(props.folderIds || ['90170955336']);
  // const [listIds, setListIds] = useState<string[]>(props.listIds || ['901701539190']);
  // const [folderlessListIds, setFolderlessListIds] = useState<string[]>(props.folderlessListIds || ['138161873']);

  const [workspaceId, setWorkspaceId] = useState<string>('18016766');
  const [spaceIds, setSpaceIds] = useState<string[]>(['30041784']);
  const [folderIds, setFolderIds] = useState<string[]>(['90170955336']);
  const [listIds, setListIds] = useState<string[]>(['901701539190']);
  const [folderlessListIds, setFolderlessListIds] = useState<string[]>(['138161873']);


  // location trigger_ids
  const [listTriggers, setListTriggers] = useState<{
    automations: [];
    shortcuts: [];
  }>();
  const [folderlessListTriggers, setFolderlessListTriggers] = useState<{
    automations: [];
    shortcuts: [];
  }>();
  const [folderTriggers, setFolderTriggers] = useState<{
    automations: [];
    shortcuts: [];
  }>();
  const [spaceTriggers, setSpaceTriggers] = useState<{
    automations: [];
    shortcuts: [];
  }>();

  const printShardFromWorkspaceId = async () => {
    if (workspaceId.length > 1) {
      const res = await axios.post('http://localhost:3001/automation/shard', {
        teamId: workspaceId,
      });
      const shard = res.data;
      setShard(shard);
    }
  };

  const getListAutomations = (listIDs: string[]) => {
    console.log(`made it ${listIDs}`);
    listIDs.forEach(async (id) => {
      console.log('get list auto call:', id, shard, token)
      const res = await axios.post('http://localhost:3001/automation/list', {
        shard: shard,
        listId: id,
        bearer: token,
      });
      setListTriggers({
        automations: res.data.automations,
        shortcuts: res.data.shortcuts,
      });
      console.log(`List workflow request:`, res.data);
    });
  };

  const getFolderlessListAutomations = (listIDs: string[]) => {
    console.log(`made it ${listIDs}`);
    listIDs.forEach(async (id) => {
      const res = await axios.post('http://localhost:3001/automation/list', {
        shard: shard,
        listId: id,
        bearer: token,
      });
      setFolderlessListTriggers({
        automations: res.data.automations,
        shortcuts: res.data.shortcuts,
      });
      console.log(`folderless list workflow request:`, res.data);
    });
  };

  const getFolderAutomations = (folderIDs: string[]) => {
    folderIDs.forEach(async (id) => {
      const res = await axios.post('http://localhost:3001/automation/folder', {
        shard: shard,
        folderId: id,
        bearer: token,
      });
      setFolderTriggers({
        automations: res.data.automations,
        shortcuts: res.data.shortcuts,
      });
      console.log(`folder ${id} workflow request`, res.data);
    });
  };

  const getSpaceAutomations = (spaceIDs: string[]) => {
    spaceIDs.forEach(async (id) => {
      const res = await axios.post('http://localhost:3001/automation/space', {
        shard: shard,
        spaceId: id,
        bearer: token,
      });
      setSpaceTriggers({
        automations: res.data.automations,
        shortcuts: res.data.shortcuts,
      });
      console.log(`space ${id} workflow request:`, res.data);
    });
  };

  const getLocation = async (trigger: any) => {
    console.log('made it here')
    const printLocation = document.getElementById(
      'trigger-location'
    ) as HTMLOutputElement;

    let location = trigger.parent_type;
    let id = trigger.parent_id;
    console.log(trigger, location);
    switch (location) {
      case 6:
        const listResponse = await axios.post(`http://localhost:3001/workspace/list`, {
          listId: id,
          token: token
        })
        let listData = listResponse.data;
        let listName = listData.name;
        printLocation.textContent = `List: ${listName}`;
        break;
      case 5:
        const folderResponse = await axios.post(`http://localhost:3001/workspace/folder`, {
          folderId: id,
          token: token
        })
        let folderData = folderResponse.data;
        let folderName = folderData.name;
        console.log('its a folder', folderResponse);
        printLocation.textContent = `Folder: ${folderName}`;
        break;
      case 4:
        const spaceResponse = await axios.post(`http://localhost:3001/workspace/space`, {
          spaceId: id,
          token: token
        })
        console.log(spaceResponse.data)
        let spaceData = spaceResponse.data;
        let spaceName = spaceData.name;
        printLocation.textContent = `Space: ${spaceName}`;
        break;
    }
  };

  const searchSpacesForTrigger = () => {
    console.log('searching Spaces')
    const trigger = document.getElementById(
      'trigger-input'
    ) as HTMLInputElement;
    const triggerInput = trigger.value;
    // const printValue = document.getElementById(
    //   'trigger-output'
    // ) as HTMLOutputElement;

    let spaceAutoTriggers = spaceTriggers?.automations;
    let spaceShortcutTriggers = spaceTriggers?.shortcuts;

    if (foundTrigger === undefined) {
      spaceAutoTriggers?.forEach((trigger: any) => {
        console.log(trigger.id, triggerInput)

        if (foundTrigger === undefined && trigger.id === triggerInput) {
          setFoundTrigger(trigger);
          getLocation(trigger);
        }
      });
    }

    if (foundTrigger === undefined) {
      spaceShortcutTriggers?.forEach((trigger: any) => {
        console.log(trigger.id, triggerInput)

        if (foundTrigger === undefined && trigger.id === triggerInput) {
          setFoundTrigger(trigger);
          getLocation(trigger);
          setShortcut(true);
        }
      });
    }
  };

  const searchFoldersForTrigger = () => {
    console.log('searching Folders')

    const trigger = document.getElementById(
      'trigger-input'
    ) as HTMLInputElement;
    const triggerInput = trigger.value;
    // const printValue = document.getElementById(
    //   'trigger-output'
    // ) as HTMLOutputElement;

    let folderAutoTriggers = folderTriggers?.automations;
    let folderShortcutTriggers = folderTriggers?.shortcuts;

    if (foundTrigger === undefined) {
      folderAutoTriggers?.forEach((trigger: any) => {
        console.log(trigger.id, triggerInput)

        if (foundTrigger === undefined && trigger.id === triggerInput) {
          setFoundTrigger(trigger);
          getLocation(trigger);
        }
      });
    }

    if (foundTrigger === undefined) {
      folderShortcutTriggers?.forEach((trigger: any) => {
        console.log(trigger.id, triggerInput)

        if (foundTrigger === undefined && trigger.id === triggerInput) {
          setFoundTrigger(trigger);
          getLocation(trigger);
          setShortcut(true);
        }
      });
    }
    searchSpacesForTrigger();
  };

  const searchFolderlessListsForTrigger = () => {
    console.log('searching Folderless lists')

    const trigger = document.getElementById(
      'trigger-input'
    ) as HTMLInputElement;
    const triggerInput = trigger.value;
    // const printValue = document.getElementById(
    //   'trigger-output'
    // ) as HTMLOutputElement;

    let folderlessListAutoTriggers = folderlessListTriggers?.automations;
    let folderlessShortcutTriggers = folderlessListTriggers?.shortcuts;

    if (foundTrigger === undefined) {
      folderlessListAutoTriggers?.forEach((trigger: any) => {
        console.log(trigger.id, triggerInput)
        if (foundTrigger === undefined && trigger.id === triggerInput) {
          setFoundTrigger(trigger);
          getLocation(trigger);
        }
      });
    }

    if (foundTrigger === undefined) {
      folderlessShortcutTriggers?.forEach((trigger: any) => {
        console.log(trigger.id, triggerInput)
        if (foundTrigger === undefined && trigger.id === triggerInput) {
          setFoundTrigger(trigger);
          getLocation(trigger);
          setShortcut(true);
        }
      });
    }
    searchFoldersForTrigger();
  };

  const searchListsForTrigger = async () => {
    console.log('searching lists')

    const trigger = document.getElementById(
      'trigger-input'
    ) as HTMLInputElement;
    const triggerInput = trigger.value;
    // const printValue = document.getElementById(
    //   'trigger-output'
    // ) as HTMLOutputElement;
    let listAutoTriggers = listTriggers?.automations;
    let listShortcutTriggers = listTriggers?.shortcuts;
    if (foundTrigger === undefined) {
      listAutoTriggers?.forEach((trigger: any) => {
        console.log(trigger.id, triggerInput)
        if (foundTrigger === undefined && trigger.id === triggerInput) {
          setFoundTrigger(trigger);
          getLocation(trigger);
        }
      });
    }

    if (foundTrigger === undefined) {
      listShortcutTriggers?.forEach((trigger: any) => {
        console.log(trigger.id, triggerInput)
        if (foundTrigger === undefined && trigger.id === triggerInput) {
          setFoundTrigger(trigger);
          getLocation(trigger);
          setShortcut(true);
        }
      });
    }
    searchFolderlessListsForTrigger();
  };

  useEffect(() => {
    console.log(foundTrigger)
    if (foundTrigger !== undefined) {
      console.log('we found it!', foundTrigger);
      const printTrigger = document.getElementById(
        'trigger-output'
      ) as HTMLOutputElement;
      const printDescription = document.getElementById(
        'automation'
      ) as HTMLOutputElement;

      printTrigger.textContent = foundTrigger.trigger.type;
      printDescription.textContent = foundTrigger.sentence;
    }
  }, [foundTrigger]);

  // useEffects for what this component has
  useEffect(() => {
    printShardFromWorkspaceId();
    console.log(`workspaceID being searched: ${workspaceId}`);
  }, [workspaceId]);
  useEffect(() => {
    console.log(`workspace shard: ${shard}`);
    console.log(`workspace token: ${token}`);
    if (shard.length > 1) {
      // when we have a bearer, we can call get automations functions on page load from here
      console.log('on page load, token is:',token)
      console.log('spaceIds:', spaceIds);
      console.log('folderIds:', folderIds);
      console.log('listIds:', listIds);
      console.log('folderlessListIds:', folderlessListIds);

      getFolderlessListAutomations(folderlessListIds);
      getListAutomations(listIds);
      getFolderAutomations(folderIds);
      getSpaceAutomations(spaceIds);
    }
  }, [shard]);
  useEffect(() => {
    console.log(`triggerID being searched: ${triggerId}`);
  }, [triggerId]);

  const style = {
    button: {
      margin: "5px"
    },
    input: {
      width: "320px"
    }
  }

  return (
    <div className="automations-container">
      <h1>The automations page</h1>
      {token ? (
        <>
          <span>Enter a trigger_id</span>
          <br />
          <input style={style.input} type="text" id="trigger-input" placeholder="triggerId" />
          <br />
          <Button
            style={style.button}
            onClick={() => {
              searchListsForTrigger();
            }}
          >
            Find Automation
          </Button>
          {foundTrigger ?
            <Button
              style={style.button}
              onClick={() => {
                const trigger = document.getElementById(
                  'trigger-input'
                ) as HTMLInputElement;
                const output = document.getElementById(
                  'trigger-output'
                ) as HTMLInputElement;
                const automation = document.getElementById(
                  'automation'
                ) as HTMLInputElement;
                const location = document.getElementById(
                  'trigger-location'
                ) as HTMLInputElement;
                trigger.value = "";
                output.textContent = "";
                automation.textContent = "";
                location.textContent = "";
                setShortcut(false);
                setFoundTrigger(undefined);
              }}
            >
              Clear
            </Button>
            :
            <></>
          }
          <h4>
            Your trigger is: <output id="trigger-output"></output>
          </h4>
          <h4>
            Your Automation is: <output id="automation"></output>
          </h4>
          {shortcut ?
            <h4>
              Your Automation is a shortcut located in this{' '}
              <output id="trigger-location"></output>
            </h4>
            :
            <h4>
              Your Automation is located in this{' '}
              <output id="trigger-location"></output>
            </h4>
          }
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Automations;
