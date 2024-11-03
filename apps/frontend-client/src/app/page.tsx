import { loggerBeautifulObject } from "@sabaicode-dev/camformant-libs";
import DashboardPage from "./dashboard/page";

export default function Home() {
    loggerBeautifulObject({
        foo: "bar",
    });

    return<DashboardPage />
}
