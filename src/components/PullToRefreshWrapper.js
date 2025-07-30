import React, { useState } from "react";
import { ScrollView, RefreshControl } from "react-native";

const PullToRefreshWrapper = ({ onRefresh, children, contentContainerStyle }) => {
    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = async () => {
        setRefreshing(true);
        await onRefresh?.();
        setRefreshing(false);
    };

    return (
        <ScrollView
            contentContainerStyle={contentContainerStyle}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
        >
            {children}
        </ScrollView>
    );
};

export default PullToRefreshWrapper;
