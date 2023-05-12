import { Tabs, Title } from "@mantine/core";
import { useState } from "react";
import { useLoaderData } from "react-router";
import TrainersEncounterTab from "../components/GameRouteTabs/TrainerEncountersTab";
import WildEncountersTab from "../components/GameRouteTabs/WildEncountersTab";

export async function loader({ params }: any) {
  return {
    routeName: params.routeName,
  };
}

const GameRoutesDetails = () => {
  const { routeName } = useLoaderData();

  const [activeTab, setActiveTab] = useState<string | null>("wild-encounters");

  return (
    <>
      <Title order={4} mt={20}>
        {routeName}
      </Title>
      <Tabs mt={20} value={activeTab} onTabChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="wild-encounters">Wild Encounters</Tabs.Tab>
          <Tabs.Tab value="trainer-encounters">Trainer Encounters</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="wild-encounters">
          <WildEncountersTab routeName={routeName} />
        </Tabs.Panel>
        <Tabs.Panel value="trainer-encounters">
          <TrainersEncounterTab routeName={routeName} />
        </Tabs.Panel>
      </Tabs>
    </>
  );
};

export default GameRoutesDetails;
