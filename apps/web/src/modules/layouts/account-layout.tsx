/**
 * Account layout used to wrap account-related pages.
 * - Both Users and Hotel Owners Layouts are wrapped with this layout
 * - This used to filter account type and render the appropriate layout
 */

import React from "react";

type Props = {
  children: React.ReactNode;
};

export async function AccountLayout({ children }: Props) {
  return <div>AccountLayout</div>;
}
