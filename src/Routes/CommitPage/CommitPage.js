//import React, { useState, useEffect } from 'react';
import React from 'react';
import { withRouter } from 'react-router-dom';

import { StackItem, Stack, Pagination } from '@patternfly/react-core';
import { Main, PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';

import {
    Table,
    TableHeader,
    TableBody,
    TableVariant
} from '@patternfly/react-table';

import PropTypes from 'prop-types';

import './commit-page.scss';
//import { render } from 'enzyme';

/**
 * A smart component that handles all the api calls and data needed by the dumb components.
 * Smart components are usually classes.
 *
 * https://reactjs.org/docs/components-and-props.html
 * https://medium.com/@thejasonfile/dumb-components-and-smart-components-e7b33a698d43
 */

export class CommitPage extends React.Component {
    static propTypes = {
        location: PropTypes.object,
        history: PropTypes.object,
        eventEmitter: PropTypes.object,
        match: PropTypes.object
    };

    constructor(props) {
        super(props);
        console.log(props.match);
        const params = new URLSearchParams(props.location.search);

        let limit = params.get('limit') === null ? 10 : params.get('limit');
        let offset = params.get('offset') === null ? 0 : params.get('offset');
        let page = params.get('page') === null ? 1 : params.get('page');
        let pageSize = params.get('pageSize') === null ? 10 : params.get('pageSize');
        this.state = {
            page,
            pageSize,
            data: {},
            columns: [],
            rows: {},
            stats: {},
            limit,
            offset,
            url: '',
            meta: {},
            app: props.match.params.app,
            commit: props.match.params.commit
        };
        this.params = new URLSearchParams(props.location.search);
    }

    grabResults() {
        console.log(this.state.url);
        fetch(this.state.url)
        .then(response => response.json())
        .then(data => this.setState({ data }, () => {
            let cols = Object.keys(data.data[0]);
            let rows = [];
            data.data.forEach(function (item) {
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

            cols = cols.map(c => c.replace('_', ' '));
            this.setState({ rows, columns: cols, meta: data.meta });
        }));
    }

    componentDidMount() {
        this.updateUrl();
    }

    updateUrl() {
        let urlBit = '/api/commit-tracker/track/';

        if (this.state.app !== undefined) {
            urlBit += this.state.app + '/';
            // statsUrl += app + '/';
        }

        if (this.commit !== undefined) {
            urlBit += this.state.commit + '/';
            // statsUrl += commit + '/';
        }

        urlBit += '?offset=' + ((this.state.page - 1) * this.state.pageSize);
        urlBit += '&limit=' + this.state.pageSize;
        this.setState({ url: urlBit }, () => {
            this.grabResults();
        });
    }

    setPage = (_event, pageNumber) => {
        console.log('NEXT PAGE');
        this.setState({ page: pageNumber }, () => {
            this.updateUrl();
        });
    }

    setPageSize = (_event, perPage) => {
        this.setState({ pageSize: perPage }, () => {
            this.updateUrl();
        });
    }

    render() {
        document.title = 'Commit Tracker';
        const {
            app,
            commit,
            data,
            columns,
            rows,
            page,
            pageSize,
            meta
        } = this.state;
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
                                    <Pagination
                                        widgetId="pagination-options-menu-bottom"
                                        perPage={pageSize}
                                        page={page}
                                        itemCount={meta.count}
                                        dropDirection="up"
                                        onSetPage={this.setPage}
                                        onPerPageSelect={this.setPageSize}
                                        style={ { marginTop: '1rem' } }
                                    />
                                    <pre>{JSON.stringify(this.stats, null, 2)}</pre>
                                    <pre style={{ visibility: 'hidden' }}>{JSON.stringify(data, null, 2)}</pre>
                                </StackItem>
                            </Stack>
                        </StackItem>
                    </Stack>
                </Main>
            </React.Fragment>
        );
    };
};

export default withRouter(CommitPage);
