import React from 'react';

export default function Actions({ children }: React.PropsWithChildren<{}>): React.ReactElement {
	return <div className="ListActions">{children}</div>;
}
