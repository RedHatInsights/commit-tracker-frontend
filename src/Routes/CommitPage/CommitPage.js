import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';

import { StackItem, Stack } from '@patternfly/react-core';
import { Main, PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';

import {
    Table,
    TableHeader,
    TableBody,
    TableVariant
} from '@patternfly/react-table';

import PropTypes from 'prop-types';

import './commit-page.scss';

/**
 * A smart component that handles all the api calls and data needed by the dumb components.
 * Smart components are usually classes.
 *
 * https://reactjs.org/docs/components-and-props.html
 * https://medium.com/@thejasonfile/dumb-components-and-smart-components-e7b33a698d43
 */

const CommitPage = ({ match }) => {

    //const [setData] = useState([]);
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [rows, setRows] = useState([]);
    const [stats, setStats] = useState([]);
    const app = match.params.app;
    const commit = match.params.commit;

    let url = '/api/commit-tracker/track/';
    let statsUrl = '/api/commit-tracker/stats/';
    if (app !== undefined) {
        url += app + '/';
        statsUrl += app + '/';
    }

    if (commit !== undefined) {
        url += commit + '/';
        statsUrl += commit + '/';
    }

    //let columns = [];

    useEffect(() => {
        fetch(url)
        .then((data) => data.json())
        .then((allData) => {
            setData(allData);
            let cols = Object.keys(allData[0]);

            let rows = [];
            allData.forEach(function (item) {
                let row = [];
                cols.forEach(function (item2) {
                    if (item2 === 'app') {
                        let url = 'internal/commit-tracker/' + item[item2];
                        row.push({ title: <a href={url}>{item[item2]}</a> });
                    } else if (item2 === 'commit_hash') {
                        let url = 'internal/commit-tracker/' + item.app + '/' + item[item2];
                        row.push({ title: <a href={url}>{item[item2]}</a> });
                    } else if (item2 === 'html_url') {
                        let url = item.html_url;
                        row.push({ title: <a href={url}>{item[item2]}</a> });
                    } else {
                        row.push(item[item2]);
                    }
                });
                rows.push(row);
            });
            setRows(rows);
            cols = cols.map(c => c.replace('_', ' '));
            setColumns(cols);

        });
        fetch(statsUrl)
        .then((stats) => stats.json())
        .then((allStats) => {
            setStats(allStats);
        });
    }, []);

    // const columns = [
    //     { title: 'Header cell' },
    //     'Branches',
    //     { title: 'Pull requests', props: { className: 'pf-u-text-align-center' } },
    //     '' // deliberately empty
    // ];
    //const rows = [['one', 'two', 'three', 'four'], ['one', 'two', 'three', 'four'], ['one', 'two', 'three', 'four']];

    return (
        <React.Fragment>
            <PageHeader>
                <PageHeaderTitle title={app}/>
                <p> {commit} </p>
            </PageHeader>
            <Main>
                <Stack hasGutter>
                    <StackItem>
                        <Stack hasGutter>
                            <StackItem>
                                <Table aria-label="Compact Table" variant={TableVariant.compact} cells={columns} rows={rows}>
                                    <TableHeader />
                                    <TableBody />
                                </Table>
                                <pre>{JSON.stringify(stats, null, 2)}</pre>
                                <pre style={{ visibility: 'hidden' }}>{JSON.stringify(data, null, 2)}</pre>
                            </StackItem>
                        </Stack>
                    </StackItem>
                </Stack>
            </Main>
        </React.Fragment>
    );
};

CommitPage.propTypes = {
    match: PropTypes.any,
    location: PropTypes.any
};

export default withRouter(CommitPage);
