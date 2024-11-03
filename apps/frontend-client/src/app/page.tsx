import { Button } from "ms-ui-components";
import { loggerBeautifulObject } from "@sabaicode-dev/camformant-libs";
import { loggerBeautifulObject } from "@sabaicode-dev/camformant-libs";
import DashboardPage from "./dashboard/page";

export default function Home() {
  loggerBeautifulObject({
    foo: "bar",
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Button />
    </main>
  );
    loggerBeautifulObject({
        foo: "bar",
    });

    return <DashboardPage />;
}
